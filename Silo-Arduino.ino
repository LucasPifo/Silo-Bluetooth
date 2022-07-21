//LIBRERIAS
#include <SoftwareSerial.h>

//PINES DEL ATMEGA 328P-U
//Sensores IR
const int pinSensorInicio = 3;
const int pinSensorLlenar = 4;
const int pinSensorLlenado = 5;
const int pinSensorParo = 6;
//Electrovalvula
const int pinRele = 7;
//Motor a pasos
const int pinDireccionMotor = 8;
const int pinPulsosMotor = 9;
//Modulo bluetooth
const int pinRecepcionBT = 10;
const int pinTransmicionBT = 11;
//PARO DE EMERGENCIA
const int paro = 2;
const int paroEmergencia = 12;
//Estado
const int pinLedEstado = 13;
int tiempoTolva = 4000;

//VARIABLES DE ESTADO
boolean arranque = false;
boolean inicio = false;
boolean llenando = false;
boolean llenado = false;
boolean terminado = false;
unsigned long tiempo1 = 0;
unsigned long tiempo2 = 0;
int estatusCaja = 0;
String comandoBT = "";

//INSTANCIAMOS LA CLASE SOFTWARESERIAL EN EL OBJETO BLUETOOTH
SoftwareSerial bluetooth(pinRecepcionBT, pinTransmicionBT);

//FUNCION DE CONFIGURACIÓN
void setup(){
  //Iniciamos la comunicación serial del bluetooth y del arduino
  Serial.begin(9600);
  bluetooth.begin(9600);
  Serial.println("Comenzando");
  //Declaramos pines de entrada y de salida
  //ENTRADAS
  pinMode(pinSensorInicio, INPUT);
  pinMode(pinSensorLlenar, INPUT);
  pinMode(pinSensorLlenado, INPUT);
  pinMode(pinSensorParo, INPUT);
  pinMode(paro, INPUT);
  //SALIDAS
  pinMode(pinDireccionMotor, OUTPUT); 
  pinMode(pinPulsosMotor, OUTPUT);
  pinMode(pinLedEstado, OUTPUT);
  pinMode(pinRele, OUTPUT);
  pinMode(paroEmergencia, OUTPUT);
  //VALORES DE INICIO
  digitalWrite(pinRele, HIGH);
  digitalWrite(pinDireccionMotor, HIGH);
  digitalWrite(pinPulsosMotor, LOW);
  //digitalWrite(paroEmergencia, HIGH);
}

//FUNCION PARA MANDAR DEL ARDUINO A LA HMI
void mandarStatus(String mensaje){
    char arreglo[50];
    mensaje.toCharArray(arreglo, 50);
    bluetooth.write(arreglo);
    Serial.println(mensaje);
}

//FUNCION PARA ENCENDER LA BANDA TRANSPORTADORA
void encenderMotor(){
    digitalWrite(pinPulsosMotor, HIGH);
    delayMicroseconds(1000);
    digitalWrite(pinPulsosMotor, LOW);
    delayMicroseconds(1000);
}

//CICLO INFINITO
void loop(){
    //Obtener instruccion desde el bluetooth
    if(bluetooth.available()){
        comandoBT = "";
        char c = bluetooth.read();
        while( c != '\n' ){ 
            comandoBT = comandoBT + c ;
            c = bluetooth.read();
        }
        if(comandoBT == "1"){
            arranque = true;
            Serial.println("Encendida!");
        }else if(comandoBT == "0"){
            arranque = false;
            Serial.println("Apagada!");
        }
    } 
    //Iniciamos el proceso desde la HMI
    if(arranque){
        boolean SensorInicio = digitalRead(pinSensorInicio);
        boolean SensorLlenar = digitalRead(pinSensorLlenar);
        boolean SensorLlenado = digitalRead(pinSensorLlenado);
        boolean SensorParo = digitalRead(pinSensorParo);
        //INICIO
        if(estatusCaja == 0){
            if(!SensorInicio){
                inicio = true;
                estatusCaja = 1;
                delay(2000);
                mandarStatus("1,1\n");
            }
        }
        //LLENANDO
        if(estatusCaja == 1){
            if(!SensorLlenar){
                inicio = false;
                llenando = true;
                estatusCaja = 2;
                delay(2000);
                digitalWrite(pinRele, LOW);
                mandarStatus("1,2\n");
                tiempo1 = millis();
            }
        }
        //LLENADO
        if(estatusCaja == 2){
            tiempo2 = millis();
            if(!SensorLlenado || tiempo2 > (tiempo1+tiempoTolva)){
                tiempo1 = millis();
                llenando = false;
                llenado = true;
                estatusCaja = 3;
                digitalWrite(pinRele, HIGH);
                mandarStatus("1,3\n");
                delay(2000);
            }
        }
        //TERMINADO
        if(estatusCaja == 3){
            if(!SensorParo){
                llenado = false;
                terminado = true;
                estatusCaja = 4;
                mandarStatus("1,4\n");
            }
        }
        if(estatusCaja == 4){
            inicio = false;
            llenando = false;
            llenado = false;
            terminado = false;
            estatusCaja = 0;
            mandarStatus("2,1\n");
            delay(2000);
        }
        if(inicio || llenado){
            encenderMotor();
            digitalWrite(pinLedEstado, HIGH);
        }else{
            digitalWrite(pinLedEstado, LOW);
        }        
    }
    if(digitalRead(paro) == 0){
      Serial.println(digitalRead(paroEmergencia));
      digitalWrite(paroEmergencia, LOW);
    }else{
      digitalWrite(paroEmergencia, HIGH);
      Serial.println(random(1, 100));
    }
}
