import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View, Alert, ToastAndroid, Animated, Easing } from 'react-native';
import BluetoothSerial, {withSubscription} from "react-native-bluetooth-serial-next";
import { Buffer } from "buffer";
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DataTable } from 'react-native-paper';

//import RNFetchBlob from 'react-native-fetch-blob';

global.Buffer = Buffer;
export default class EscenarioScreen extends Component {
  static navigationOptions = {
    title: 'Control',
    headerStyle: {
      backgroundColor: '#F26000',
    },
    headerTintColor: '#FFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(props){
    super(props);
    this.state = {
      id: this.props.navigation.state.params.id,
      valorArduino: "",
      animate: new Animated.Value(15),
      motorEncendido: false,
      llenando: false,
      llenado: false,
      terminado: false,
      contador: 0,
      datosTabla: []
    };
    this.RotateValueHolder = new Animated.Value(0);
  }

  componentWillMount(){
    this.obtenerDatos(this.state.id);
  }

  enviarDatos = async (id, mensaje) => {
    try {
      //if(this.state.conectado){
        await BluetoothSerial.device(id).write(mensaje);
        ToastAndroid.show("Datos enviados exitosamente!", ToastAndroid.SHORT);
      //}
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };

  obtenerDatos = async (id) => {
    try {
      BluetoothSerial.device(id).readEvery(
        (data, intervalId) => {          
          if(data){
            //condicionar por comas
            this.setState({
              valorArduino: data
            });
            let comandos = this.state.valorArduino.split(',');
            let d = new Date();   
            let fecha = d.getDay()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getUTCHours()+':'+d.getMinutes()+':'+d.getSeconds();        
            let datos = [];
            if(comandos[0] == 0){
              if(comandos[1] == 1){
                datos = ["Sensor 1 obstruido", fecha]; 
              }else if(comandos[1] == 2){
                datos = ["Sensor 2 obstruido", fecha];
              }else if(comandos[1] == 3){
                datos = ["Sensor 3 obstruido", fecha];
              }else if(comandos[1] == 4){
                datos = ["Sensor 4 obstruido", fecha];
              }
              this.setState({
                tableData: this.state.tableData.push(datos)
              });
            }
            if(comandos[0] == 1){
              if(comandos[1] == 1){
                this.ejecutarAnimacion();
                this.setState({estatusVanda: true, terminado: false});
              }else if(comandos[1] == 2){
                this.setState({estatusVanda: false, llenando : true});
              }else if(comandos[1] == 3){
                this.terminarCiclo();
                this.setState({estatusVanda: true, llenando: false, llenado: true});
              }
              else if(comandos[1] == 4){
                this.setState({ terminado: true, llenado: false, estatusVanda : false, llenando: false, animate: new Animated.Value(15) });
              }
            }
            if(comandos[0] == 2){
                datos = {estatus : "Recipiente "+comandos[1], fecha: fecha};
                let datosNuevos = [this.state.datosTabla.push(datos)];
                this.setState({ 
                  contador : (parseInt(this.state.contador) + parseInt(comandos[1])),
                  datosTabla: datosNuevos
                 });
                /*const values = [
                  ['build', '2017-11-05T05:40:35.515Z'],
                  ['deploy', '2017-11-05T05:42:04.810Z']
                ];
                
                // construct csvString
                const headerString = 'event,timestamp\n';
                const rowString = values.map(d => `${d[0]},${d[1]}\n`).join('');
                const csvString = `${headerString}${rowString}`;
                
                // write the current list of answers to a local csv file
                const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/data.csv`;
                console.log('pathToWrite', pathToWrite);
                // pathToWrite /storage/emulated/0/Download/data.csv
                RNFetchBlob.fs
                  .writeFile(pathToWrite, csvString, 'utf8')
                  .then(() => {
                    console.log(`wrote file ${pathToWrite}`);
                    // wrote file /storage/emulated/0/Download/data.csv
                  })
                  .catch(error => console.error(error));*/
            }                                    
            if(this.state.valorArduino.includes("Cancelar")){
              clearInterval(intervalId);
            }
          }
        },
        100,
        "\n"
      );
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start();
  }

  ejecutarAnimacion = ()=>{
    Animated.timing(
      this.state.animate, {
        toValue : 130,
        duration: 3700
      }).start();
      this.StartImageRotateFunction();
  }

  terminarCiclo = ()=>{
    Animated.timing(
      this.state.animate, {
        toValue : 250,
        duration: 11500
      }).start();
      this.StartImageRotateFunction();
  }

  mostrarTabla = () =>{
    return(
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Estatus</DataTable.Title>
          <DataTable.Title>Fecha</DataTable.Title>
        </DataTable.Header>
        {this.state.datosTabla.map((datos) =>
        <DataTable.Row key={datos}>
          <DataTable.Cell>{datos}</DataTable.Cell>
          <DataTable.Cell>{datos}</DataTable.Cell>
        </DataTable.Row>
        )}
      </DataTable>
    );
  }

  mensaje = (texto, titulo = "Alerta") =>{
    Alert.alert(
      titulo,
      texto,
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  render() {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <ScrollView style={styles.container}>
        <Button
          buttonStyle={styles.boton}
          title='Encender'
          onPress={()=>{this.enviarDatos(this.state.id,"1\n")}} />
        <Button
          buttonStyle={styles.boton}
          title='Apagar'
          onPress={()=>{this.enviarDatos(this.state.id,"0\n")}} />           
        <Card title='ESTATUS DEL SILO'>
          <Text>Motor encendido {this.state.estatusVanda ? <Icon name="circle" color="#67B730" size={20} /> : null }</Text>
          <Text>Llenando {this.state.llenando ? <Icon name="circle" color="#67B730" size={20} /> : null }</Text>
          <Text>Llenado {this.state.llenado ? <Icon name="circle" color="#67B730" size={20} /> : null }</Text>
          <Text>Terminado {this.state.terminado ? <Icon name="circle" color="#67B730" size={20} /> : null }</Text>
          <Text>Producción {this.state.contador }</Text>
        </Card>
        <View style={{alignContent: 'center'}}>
          <Icon name="filter" color="#6A6A6A" size={90} style={styles.tolva} />
          <Animated.View style={{ position: 'absolute', top: 151, zIndex: 1, transform: [{ rotate: RotateData }]}}>
            <Icon name="life-saver" color="#C1C1C1" size={29} />
          </Animated.View >
          <Animated.View style={{position: 'absolute',top: 151,left: 302,zIndex: 1, transform: [{ rotate: RotateData }]}}>
            <Icon name="life-saver" color="#C1C1C1" size={29} />
          </Animated.View>
          <View style={styles.banda}/>
          <View style={styles.pata1}/>
          <View style={styles.pata2}/>
          <Animated.View style={{position: 'absolute', top: 100, left: this.state.animate}}>
            <Icon name="archive" size={50} style={styles.caja} />
          </Animated.View>
        </View>
          <View style={styles.containerTabla}>
            {this.mostrarTabla()}
        </View>
      </ScrollView>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  boton: {
    padding: 15,
    marginTop: 15,
    backgroundColor: '#F26000',
    borderRadius: 3,
  },
  banda: {
    marginTop: 60,
    width: 330,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#252525',
    zIndex: -1
  },
  tolva:{
    marginLeft: 120,
  },
  pata1:{
    marginLeft: 20,
    width: 30,
    height: 100,
    backgroundColor: '#974E1E'
  },
  pata2:{
    marginTop: -100,
    marginLeft: 280,
    width: 30,
    height: 100,
    backgroundColor: '#974E1E'
  },
  caja:{
    color: '#D2862B'
  },
  containerTabla: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff' 
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },
  textTabla: {
     margin: 6
  }
});
//export default withSubscription({ subscriptionName: "events" })(EscenarioScreen);