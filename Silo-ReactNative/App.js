import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './pages/Home';
import ConexionScreen from './pages/Conexion';
import EscenarioScreen from './pages/Escenario';

const RootStack = createStackNavigator({
  Home: HomeScreen,
  Conexion: ConexionScreen,
  Escenario: EscenarioScreen
},{
  initialRouteName: 'Home'
});
 
const AppContainer = createAppContainer(RootStack);

type Props = {}
export default class App extends Component<Props> {
  render() {
    return (
      <AppContainer/>
    );
  }
}
