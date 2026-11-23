# Lotería Push

Juego de Lotería mexicana con un cantor ejecutado en un servidor Node.js y una aplicación Flutter para Android/iOS. El servidor conserva la verdad de la partida y las notificaciones push funcionan únicamente como avisos: la app puede recuperar cartas perdidas, ignorar duplicados y volver a sincronizarse.

**Autora:** Lluvia Villanueva - GitHub: [Lluvia-18](https://github.com/Lluvia-18)

## Aplicación terminada

La aplicación puede ejecutarse localmente sin Firebase. En ese modo consulta periódicamente al servidor y permite crear una sala, unirse como jugador, recibir las cartas cantadas y reclamar Lotería. Al configurar Firebase, también admite avisos push reales.

<p align="center">
  <img src="docs/images/tdd/app-final.png" alt="Lotería Push ejecutándose en Android" width="360">
</p>

## Arquitectura

- `server/`: servidor Node.js, reglas, salas, mensajes push y API HTTP.
- `app/`: aplicación Flutter, dominio, adaptadores de Firebase/HTTP y pantallas.
- El servidor decide cartas, ganadores, permisos del cantor y frenos contra abuso.
- La app trata cada push como información no confiable y consulta el estado real cuando detecta huecos.
- El modo local degrada correctamente cuando Firebase todavía no está configurado.

## Resultado de las pruebas

| Componente | Pruebas | Resultado |
| --- | ---: | --- |
| Servidor Node.js | 61 | Aprobadas |
| Aplicación Flutter | 52 | Aprobadas |
| **Total** | **113** | **Todas aprobadas** |

## Ciclos TDD

Cada ciclo incluye una fase roja real, obtenida retirando temporalmente la implementación en una copia de evidencia, y una fase verde ejecutada con la implementación restaurada. Las capturas muestran el código, la terminal completa y el usuario Git `Lluvia-18`.

### Ciclo 1 - Baraja y tablas

Corresponde a la ronda 2 del manual. Comprueba las 54 cartas, la decisión de inclusión, la búsqueda por identificador, Fisher-Yates con semilla y tablas de 16 cartas distintas.

#### Fase roja

![Baraja en fase roja](docs/images/tdd/01-baraja-roja.png)

#### Fase verde

![Baraja en fase verde](docs/images/tdd/01-baraja-verde.png)

### Ciclo 2 - Mensajes push correctos

Corresponde a la ronda 3. Verifica destinos, datos convertidos a texto, TTL, prioridad, canales, colapso de mensajes y el límite de 4 KB.

#### Fase roja

![Mensajes en fase roja](docs/images/tdd/02-mensajes-roja.png)

#### Fase verde

![Mensajes en fase verde](docs/images/tdd/02-mensajes-verde.png)

### Ciclo 3 - Sala, autorización y trampas

Corresponde a la ronda 4. Prueba la unión de jugadores, nombres y destinos válidos, límite de participantes, mazo secreto, freno del cantor, reclamos y avisos personales de “casi”.

#### Fase roja

![Sala en fase roja](docs/images/tdd/03-sala-roja.png)

#### Fase verde

![Sala en fase verde](docs/images/tdd/03-sala-verde.png)

### Ciclo 4 - Servidor HTTP seguro

Corresponde a la ronda 5. Cubre el flujo HTTP completo, claves del cantor, códigos de error, recuperación del estado, tokens muertos, destinos FID, entradas inválidas y errores internos seguros.

#### Fase roja

![Servidor HTTP en fase roja](docs/images/tdd/04-servidor-http-roja.png)

#### Fase verde

![Servidor HTTP en fase verde](docs/images/tdd/04-servidor-http-verde.png)

### Ciclo 5 - Eventos recibidos y patrones

Corresponde a la ronda 6. Comprueba que los datos del push se analicen con desconfianza, que la sala se normalice y que filas, columnas, diagonales, esquinas, centro y tabla llena se detecten igual que en el servidor.

#### Fase roja

![Eventos y líneas en fase roja](docs/images/tdd/05-eventos-lineas-roja.png)

#### Fase verde

![Eventos y líneas en fase verde](docs/images/tdd/05-eventos-lineas-verde.png)

### Ciclo 6 - Estado de la partida

Verifica idempotencia, detección de huecos, lotes desordenados, cartas marcadas, habilitación del botón Lotería, ganador y avisos de “casi”.

#### Fase roja

![Partida en fase roja](docs/images/tdd/06-partida-roja.png)

#### Fase verde

![Partida en fase verde](docs/images/tdd/06-partida-verde.png)

### Ciclo 7 - Puerto push y controlador

Corresponde a las rondas 7 y 8. Verifica permisos, suscripción al tema, juego sin notificaciones, duplicados, huecos, sincronización, actualización del destino, restauración de sesión y salida segura.

#### Fase roja

![Controlador en fase roja](docs/images/tdd/07-controlador-roja.png)

#### Fase verde

![Controlador en fase verde](docs/images/tdd/07-controlador-verde.png)

### Ciclo 8 - Pantalla del juego

Corresponde a la ronda 9. Comprueba la sala, el estado de espera, la advertencia cuando no hay push, la tabla y la activación o bloqueo del botón Lotería.

#### Fase roja

![Pantalla en fase roja](docs/images/tdd/08-pantalla-roja.png)

#### Fase verde

![Pantalla en fase verde](docs/images/tdd/08-pantalla-verde.png)

## Ejecuciones completas

### Servidor: 61 pruebas

![Ejecución completa del servidor](docs/images/tdd/09-servidor-61-pruebas.png)

### Aplicación: 52 pruebas

![Ejecución completa de Flutter](docs/images/tdd/10-app-52-pruebas.png)

## Ejecutar localmente

### 1. Iniciar el servidor

Desde la raíz del proyecto:

```powershell
cd server
npm.cmd test
node servidor.js
```

El servidor queda disponible en `http://localhost:8080`. Sin credenciales Firebase, los envíos push se simulan en la consola.

### 2. Ejecutar la aplicación

En otra terminal:

```powershell
cd app
flutter pub get
flutter analyze
flutter test
flutter run --dart-define=SERVIDOR=http://10.0.2.2:8080
```

`10.0.2.2` es la computadora anfitriona vista desde el emulador Android. En un teléfono real debe utilizarse la IP local de la computadora.

## Firebase opcional

La app funciona sin Firebase mediante `PuertoSinFirebase`. Para activar notificaciones reales:

```powershell
firebase login
dart pub global activate flutterfire_cli
cd app
flutterfire configure
```

La cuenta de servicio de Firebase pertenece únicamente al servidor. Nunca debe incluirse dentro de la app, GitHub, capturas o mensajes.

## Verificación final

- Node.js 20 o superior: 61 pruebas aprobadas.
- `flutter analyze`: sin problemas.
- Flutter: 52 pruebas aprobadas.
- APK de depuración compilado con Android SDK 37.
- Aplicación instalada y ejecutada en `emulator-5554`.
- Servidor local ejecutado en el puerto 8080.

## Privacidad y seguridad

Los temas de FCM son públicos y ninguna notificación debe contener secretos. El servidor valida ganadores, claves y destinos; elimina tokens muertos cuando corresponde y limita la frecuencia de los cantos. Las notificaciones pueden aparecer en la pantalla bloqueada, por lo que sólo contienen información apropiada para mostrarse públicamente.
