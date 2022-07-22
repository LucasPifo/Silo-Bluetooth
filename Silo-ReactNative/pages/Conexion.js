import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, TouchableHighlight, ToastAndroid, ScrollView, Animated, ActivityIndicator} from 'react-native';
import BluetoothSerial, {withSubscription} from "react-native-bluetooth-serial-next";
import { Buffer } from "buffer";
import Modal from 'react-native-modal';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

global.Buffer = Buffer;
export default class ConexionScreen extends Component{
  static navigationOptions = {
    title: 'Conexión',
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
      estatusbluetooth: null,
      dispositivos : [],
      lisaDeDispositivos: false,
      cargando: true,
      modal: false,
      dispositivoSeleccionado : [],
      conectado: false,
      valorArduino: null,
      dispositivoConectado: null
    };
  }

  componentWillMount(){
    this.activadoDesactivado();
  }

  componentDidMount(){
    this.setState({
      cargando : false,
    });
  }

  habilitarBluetooth = async ()=>{
    try{
      let habilitarBluetooth = await BluetoothSerial.requestEnable();
      if(habilitarBluetooth){
        this.setState({
          estatusbluetooth : true,
        });
        //this.props.navigation.setParams({bluetooth: this.state.estatusbluetooth});
        ToastAndroid.show("Bluetoooth activado!", ToastAndroid.SHORT);        
      }else{
        ToastAndroid.show("Se cancelo el permiso para activar el bluetooth!", ToastAndroid.SHORT);
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  apagarBluetooth = async ()=>{
    try{
      let apagarBluetooth = await BluetoothSerial.disable();
      if(apagarBluetooth){
        this.setState({
          estatusbluetooth : false,
          lisaDeDispositivos: false,
        });
        ToastAndroid.show("Se desactivó el bluetooth!", ToastAndroid.SHORT);        
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  activadoDesactivado = async ()=>{
    try{
      let estaHabilitado = await BluetoothSerial.isEnabled();
      if(estaHabilitado){
        this.setState({
          estatusbluetooth : true,
        });
      }else{
        this.setState({
          estatusbluetooth : false,
        });
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  siEstaConectado = async (id)=>{
    try{
      const isConnected = await BluetoothSerial.isConnected(id);
      if(isConnected){
        this.setState({ dispositivoConectado : id }) 
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  obtenerListaDispositivos = async ()=>{  
    this.setState({ cargando : true })  
    try{
      let listaDispositivos = await BluetoothSerial.list();
      if(this.state.estatusbluetooth){
        this.setState({
          dispositivos : listaDispositivos,
          lisaDeDispositivos : true,
          cargando : false,
        });
      }else{
        ToastAndroid.show("No tienes activado el bluetooth!", ToastAndroid.SHORT);
        this.setState({
          cargando : false
        });
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  conectarDispositivo = async (id,nombre)=>{
    this.setState({ cargando : true })
    try{
      const conectado = await BluetoothSerial.connect(id);
      if(conectado){
        this.setState({
          conectado : true,
          cargando : false,
          dispositivoConectado : id
        });
        ToastAndroid.show(`Conexion al ${nombre} con exito!`, ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("No se pudo conectar al dispositivo!", ToastAndroid.SHORT);
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  desconectarDispositivo = async (id,nombre)=>{
    this.setState({ cargando : true })
    try{
      const desconectado = await BluetoothSerial.disconnect(id);
      if(desconectado){
        this.setState({
          cargando : false
        });
        ToastAndroid.show(`Desconectado al ${nombre} con exito!`, ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("No se pudo desconectar al dispositivo!", ToastAndroid.SHORT);
      }
    }catch(e){
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  renderDispositivos = () =>{
    return(
      this.state.dispositivos.map((disp) =>
        <TouchableHighlight key={disp.id} style={styles.listaDispositivo} underlayColor="#eee" onPress={()=>{
          this.setState({ 
            modal: true,
            dispositivoSeleccionado : [disp.id, disp.name]
           });
           this.siEstaConectado(this.state.dispositivoSeleccionado[0]);
        }}>
          <Text style={styles.textoDispositivo}>
            {disp.name}
          </Text>
        </TouchableHighlight>
      )
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
    return (
      <ScrollView style={styles.container}>
        <Button
            icon={{ name:"bluetooth", color: "white", type: "font-awesome" }}
            title={this.state.estatusbluetooth ? "Apagar Bluetooth" : "Encender Bluetooth" }
            buttonStyle={styles.boton}
            onPress={()=>{this.state.estatusbluetooth ? this.apagarBluetooth() : this.habilitarBluetooth()}}
        />
        <Button
            icon={{ name:"list", color: "white", type: "font-awesome" }}
            title="Obtener Lista De Dispositivos"
            buttonStyle={styles.boton}
            onPress={()=>{this.obtenerListaDispositivos()}}
        />
        <View style={{marginTop: 20}}>
          {this.state.lisaDeDispositivos ? this.renderDispositivos() : null }
        </View>
        <Modal isVisible={this.state.modal}>
          <ScrollView>
            <Card title='DISPOSITIVO'>
              <Icon name="mobile" color="#6A6A6A" size={70} style={{alignItems: 'center', justifyContent:'center', textAlign: 'center', alignContent: 'center'}} />
              <Text style={styles.textoDispositivo}>{this.state.dispositivoSeleccionado[1]}</Text>
              <Text style={styles.textoDispositivo}>{this.state.dispositivoSeleccionado[0]}</Text>            
              <Button
                buttonStyle={styles.botonDispositivo}
                title='Conectar'
                onPress={()=>{this.conectarDispositivo(this.state.dispositivoSeleccionado[0],this.state.dispositivoSeleccionado[1])}} />
              <Button
                buttonStyle={styles.botonDispositivo}
                title='Desconectar'
                onPress={()=>{this.desconectarDispositivo(this.state.dispositivoSeleccionado[0],this.state.dispositivoSeleccionado[1])}} />
              {this.state.dispositivoConectado == this.state.dispositivoSeleccionado[0] ? 
              <Button
                buttonStyle={styles.botonDispositivo}
                title='Ver control'
                onPress={()=>{
                  this.setState({ modal: false });
                  this.props.navigation.navigate('Escenario', { id: this.state.dispositivoSeleccionado[0] });
                }} /> : null}
              {/* <Button
                backgroundColor='#03A9F4'
                buttonStyle={styles.boton}
                title='Encender'
                onPress={()=>{this.enviarDatos(this.state.dispositivoSeleccionado[0],"1,\n")}} />
              <Button
                backgroundColor='#03A9F4'
                buttonStyle={styles.boton}
                title='Apagar'
                onPress={()=>{this.enviarDatos(this.state.dispositivoSeleccionado[0],"0,\n")}} /> */}
              <Button
                buttonStyle={styles.botonDispositivo}
                title='Cerrar'
                onPress={()=>{this.setState({ modal: false })}} />
                {/* <View>
                  <Animated.Text>{this.state.valorArduino}</Animated.Text>
                </View> */}
            </Card>
          </ScrollView>
        </Modal>
        <Modal isVisible={this.state.cargando}>
          <View >
            <ActivityIndicator size="large" color="#F26000" />
          </View>
        </Modal>
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
  botonDispositivo:{
    padding: 10,
    marginTop: 10,
    backgroundColor: '#F26000',
    borderRadius: 3,
  },
  texto: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  listaDispositivo:{
    padding: 15,
    marginTop: 7,
    borderBottomColor: '#CFCFCF',
    borderBottomWidth: 1,
    backgroundColor: '#F6F6F6',
  },
  textoDispositivo: {
    textAlign: 'center',
    fontSize: 15,
  }
});

// export default withSubscription({
//   subscriptionName: 'events',
//   destroyOnWillUnmount: true,
// })(App);