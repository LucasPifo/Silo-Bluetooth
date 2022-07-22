# Silo-Bluetooth
Silo para almacenamiento de grano desarrollado con el microcontrolador ATMEGA328-PU programado con la plataforma ARDUINO, controlado mediante comandos Serial con el módulo Bluetooth hc-06 y comunicación a Aplicación Mobile desarrollada en React Native.

## Modulos utilizados
<ol>
  <li>Microcontrolador ATMEGA328-PU</li>
  <li>Modulo HC-06</li>
  <li>sensores IR(4)</li>
  <li>Relevador de 5v</li>
  <li>Motor a pasos unipolar</li>
  <li>Driver TB6560</li>
  <li>Actuador</li>
</ol>

## Instrucciones
El desarrollo del sistema esta devidido en 2 partes la parte de electrónica(ATMEGA328) y la parte de desarrollo mobile(React Native).
Importante tener instalado <b>Arduino y React Native</b>.

### Electrónica
<ol>
  <li>Cargar el archivo <a href="https://github.com/LucasPifo/Silo-Bluetooth/blob/master/Silo-Arduino.ino">Silo-Arduino.ino</a> en el microcontrolador ATMEGA328-PU o placa Arduino.</li>
  <li>Realizar conexiones electricas de cada uno de los sensores y modulos siguiendo el siguiente <a href="https://raw.githubusercontent.com/LucasPifo/Silo-Bluetooth/53de85106cc2e4ae1501e00261a25fead3e7e574/Diagrama%20silo.svg">diagrama</a>.</li>
  <li>Probar con cualquier aplicación de comunicación por bluetooth como <b>Serial Bluetooth Terminal(Android)</b> para el envío y recepción de datos.</li>
</ol>

### Diagrama esquematico
![alt text](https://raw.githubusercontent.com/LucasPifo/Silo-Bluetooth/53de85106cc2e4ae1501e00261a25fead3e7e574/Diagrama%20silo.svg)
<hr>

### Desarrollo mobile(React Native)
Librerias utilizadas para app Mobile:
<ol>
  <li><a href="https://www.npmjs.com/package/react-native-bluetooth-serial-next">react-native-bluetooth-serial-next</a></li>
  <li><a href="https://reactnativeelements.com/docs/installation">react-native-elements</a></li>
  <li><a href="https://www.npmjs.com/package/react-native-modal">react-native-modal</a></li>
</ol>

Dentro de la carpeta <a href="https://github.com/LucasPifo/Silo-Bluetooth/tree/master/Silo-ReactNative">Silo-ReactNative</a> ejecutar el comando <code>npm install</code>.
Despues ejecutar el comando <code>react-native run-android</code>.

### Interfaz en Figma
![alt text](https://github.com/LucasPifo/Silo-Bluetooth/blob/master/interfazSilo.jpg?raw=true)

<b>Nota:</b> Dicho sistema se puede mejorar y desarrollar de otra forma, por ejemplo cambiar el motor a pasos por un motoreductor 0 tambien se puede modificar el tiempo de movimiento del contenedor en la app, dichas modificaciones conllevan modificaciones de software.
En el actuador se utilizo una electrovalvula neumatica para la activacion de un piston para cuestiones prácticas, pero puede cambiarse por un servomotor o cualquier actuador.