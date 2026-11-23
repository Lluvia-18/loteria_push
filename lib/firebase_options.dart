// MARCADOR DE POSICIÓN: este archivo lo REEMPLAZA `flutterfire configure`
// (lo hace el script preparar_app.js / 2_preparar_app.bat por ti).
// Existe solo para que el proyecto compile y `flutter test` corra antes de
// conectar tu proyecto de Firebase.
import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform => throw UnsupportedError(
    'Falta conectar Firebase: ejecuta `flutterfire configure` dentro de la '
    'carpeta app (o corre preparar_app.js, que te guía).',
  );
}
