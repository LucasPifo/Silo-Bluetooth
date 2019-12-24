import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements'
 
export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#F26000',
    },
    headerTintColor: '#FFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  render() {
    return (
      <View style={{marginTop: 20}}>
        <Card
          title='BIENVENIDO'>
          <Text style={{marginBottom: 10}}>
            Este es una demostracion de un control de un sistema electronico utilizando comandos por bluetooth
            a travez de un celular, para esto es necesario vincular el smartphone con algun bluetooth.
          </Text>
          <Button
            icon={{ name:"compress", color: "white", type: "font-awesome" }}
            title="Conectar dispositivo"
            buttonStyle={styles.boton}
            onPress={()=>{this.props.navigation.navigate('Conexion')}}/>
        </Card>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  boton: {
    padding: 15,
    marginTop: 15,
    backgroundColor: '#F26000',
    borderRadius: 3,
  }
});