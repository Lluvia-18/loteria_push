import '../dominio/api_juego.dart';
import '../dominio/puerto_push.dart';

/// Modo local para jugar contra el servidor sin configurar una cuenta Firebase.
/// La app consulta periódicamente el estado, por lo que sigue siendo funcional.
class PuertoSinFirebase implements PuertoPush {
  const PuertoSinFirebase();

  @override
  Future<PermisoPush> estadoPermiso() async => PermisoPush.denegado;

  @override
  Future<PermisoPush> pedirPermiso() async => PermisoPush.denegado;

  @override
  Future<DestinoPush?> obtenerDestino() async => null;

  @override
  Stream<DestinoPush> get destinoCambiado => const Stream.empty();

  @override
  Stream<MensajePush> get enPrimerPlano => const Stream.empty();

  @override
  Stream<MensajePush> get alAbrirDesdeNotificacion => const Stream.empty();

  @override
  Future<MensajePush?> mensajeInicial() async => null;

  @override
  Future<void> suscribirTema(String tema) async {}

  @override
  Future<void> desuscribirTema(String tema) async {}
}
