'use strict';
// Prepara la app Flutter: crea las carpetas android/ios, parchea el manifiesto y
// Gradle, instala dependencias y (opcional) conecta Firebase.  Es seguro repetirlo.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const APP = __dirname;
const win = process.platform === 'win32';

function correr(cmd, args, { cwd = APP, fatal = true } = {}) {
  console.log(`\n$ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: win });
  if (r.status !== 0 && fatal) {
    console.error(`\nFalló: ${cmd} ${args.join(' ')}`);
    process.exit(1);
  }
  return r.status === 0;
}
function leerTodo(dir, base = dir, out = {}) {
  if (!fs.existsSync(dir)) return out;
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) leerTodo(p, base, out);
    else out[path.relative(APP, p)] = fs.readFileSync(p);
  }
  return out;
}

// 0) ¿Hay Flutter?
if (spawnSync('flutter', ['--version'], { shell: win, stdio: 'ignore' }).status !== 0) {
  console.error('No encuentro "flutter" en el PATH. Instálalo desde https://docs.flutter.dev/get-started/install y vuelve a correr este script.');
  process.exit(1);
}

// 1) flutter create sobre la carpeta existente, sin pisar NUESTRO código.
const respaldo = { ...leerTodo(path.join(APP, 'lib')), ...leerTodo(path.join(APP, 'test')) };
respaldo['pubspec.yaml'] = fs.readFileSync(path.join(APP, 'pubspec.yaml'));
correr('flutter', ['create', '--project-name', 'loteria_push', '--org', 'mx.edu.utng', '--platforms=android,ios', '.']);
for (const [rel, datos] of Object.entries(respaldo)) {
  fs.mkdirSync(path.dirname(path.join(APP, rel)), { recursive: true });
  fs.writeFileSync(path.join(APP, rel), datos);
}
const plantilla = path.join(APP, 'test', 'widget_test.dart'); // la prueba de ejemplo no aplica aquí
if (!respaldo[path.join('test', 'widget_test.dart')] && fs.existsSync(plantilla)) fs.unlinkSync(plantilla);

// 2) AndroidManifest.xml
const manifiesto = path.join(APP, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifiesto)) {
  let x = fs.readFileSync(manifiesto, 'utf8');
  const permisos = [];
  if (!x.includes('android.permission.INTERNET')) permisos.push('<uses-permission android:name="android.permission.INTERNET"/>');
  if (!x.includes('android.permission.POST_NOTIFICATIONS')) permisos.push('<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>');
  if (permisos.length) x = x.replace(/<application/, `${permisos.join('\n    ')}\n    <application`);
  if (!x.includes('usesCleartextTraffic')) x = x.replace(/<application/, '<application\n        android:usesCleartextTraffic="true"'); // SOLO desarrollo
  if (!x.includes('default_notification_channel_id')) {
    x = x.replace(/<\/application>/, '    <meta-data\n            android:name="com.google.firebase.messaging.default_notification_channel_id"\n            android:value="cartas" />\n    </application>');
  }
  fs.writeFileSync(manifiesto, x);
  console.log('AndroidManifest.xml listo (INTERNET, POST_NOTIFICATIONS, http local, canal "cartas").');
} else console.warn('AVISO: no encontré AndroidManifest.xml; agrega los permisos a mano (manual, Ronda 1).');

// 3) Gradle: minSdk 23 (Firebase) y desugaring (flutter_local_notifications)
const dirGradle = path.join(APP, 'android', 'app');
const kts = path.join(dirGradle, 'build.gradle.kts');
const groovy = path.join(dirGradle, 'build.gradle');
if (fs.existsSync(kts)) {
  let g = fs.readFileSync(kts, 'utf8');
  if (!g.includes('isCoreLibraryDesugaringEnabled')) g = g.replace(/compileOptions\s*\{/, 'compileOptions {\n        isCoreLibraryDesugaringEnabled = true');
  g = g.replace(/minSdk\s*=\s*flutter\.minSdkVersion/, 'minSdk = maxOf(23, flutter.minSdkVersion)');
  if (!g.includes('desugar_jdk_libs')) g += '\ndependencies {\n    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")\n}\n';
  fs.writeFileSync(kts, g);
  console.log('build.gradle.kts parchado (minSdk 23 + desugaring).');
} else if (fs.existsSync(groovy)) {
  let g = fs.readFileSync(groovy, 'utf8');
  if (!g.includes('coreLibraryDesugaringEnabled')) g = g.replace(/compileOptions\s*\{/, 'compileOptions {\n        coreLibraryDesugaringEnabled true');
  g = g.replace(/minSdkVersion\s+flutter\.minSdkVersion/, 'minSdkVersion Math.max(23, flutter.minSdkVersion)');
  if (!g.includes('desugar_jdk_libs')) g += "\ndependencies {\n    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.4'\n}\n";
  fs.writeFileSync(groovy, g);
  console.log('build.gradle parchado (minSdk 23 + desugaring).');
} else console.warn('AVISO: no encontré build.gradle(.kts); si la compilación falla, activa desugaring y minSdk 23.');

// 4) Dependencias y pruebas
correr('flutter', ['pub', 'get']);
console.log('\n== Pruebas de la app (el manual advierte que este código Dart no se ejecutó antes) ==');
correr('flutter', ['test'], { fatal: false });

// 5) Firebase
console.log(`
==================== SIGUIENTE (necesita TU cuenta de Firebase) ====================
  firebase login
  dart pub global activate flutterfire_cli
  cd ${APP}
  flutterfire configure      (acepta sobrescribir lib/firebase_options.dart)

Después, con el servidor corriendo (1_iniciar_servidor):
  flutter run --dart-define=SERVIDOR=http://10.0.2.2:8080     (emulador Android)
  flutter run --dart-define=SERVIDOR=http://TU_IP:8080        (teléfono real)
=====================================================================================`);
