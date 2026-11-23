# Lotería Push (Manual TDD – Desarrollo Móvil Integral, UTNG)

Código extraído tal cual del manual `Manual_TDD_LoteriaPush`: servidor Node (el cantor) + app Flutter.

## 1) Servidor (funciona ya, sin Firebase) — requiere Node 20+
- Windows: doble clic a `1_iniciar_servidor.bat`  ·  Mac/Linux: `./1_iniciar_servidor.sh`
- O a mano: `cd server && npm start` → http://localhost:8080 (los push salen "simulados" en consola)
- Pruebas: `cd server && npm test` (61 pruebas, todas pasan)

## 2) App Flutter — requiere Flutter instalado
- Windows: doble clic a `2_preparar_app.bat`  ·  Mac/Linux: `./2_preparar_app.sh`
  (crea android/ios, parchea el manifiesto y Gradle, hace `flutter pub get` y `flutter test`)
- Luego conecta TU Firebase (no se puede incluir en un zip; es de tu cuenta):
  `firebase login` → `dart pub global activate flutterfire_cli` → en la raíz: `flutterfire configure`
- Ejecuta: `flutter run --dart-define=SERVIDOR=http://10.0.2.2:8080`
  (emulador Android; en teléfono real usa la IP de tu compu, p. ej. http://192.168.1.50:8080)

## Notas
- Para push REALES: `FCM_REAL=1 node servidor.js` con `GOOGLE_APPLICATION_CREDENTIALS` y `npm i firebase-admin` (usa `FCM_DRY_RUN=1` para solo validar).
- iOS necesita iPhone real, llave APNs (.p8) y capacidades en Xcode (ver manual, Ronda 1).
- `lib/firebase_options.dart` es un marcador; `flutterfire configure` lo reemplaza.
- El manual advierte que el código Dart no se ejecutó al escribirlo: si `flutter test` marca algo, corrígelo con la guía del manual.
