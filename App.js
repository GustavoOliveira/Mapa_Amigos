import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './src/screen/Menu'
import Amigos from './src/screen/Amigos'
import Login from './src/screen/Login'
import Mapa from './src/screen/Mapa'

//TODO tarefa a fazer
/*
  Botão de Novo Registro de Usuário
  Logoff
  Segmentação de Dados por Usuário
  Caixa de Texto para Pesquisa de Tarefas
*/


//Desabilitano Warnings
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Setting a timer'])

//Configurando Encondig
import { decode, encode } from 'base-64'
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Menu" component={ Menu }
          options={{
            title: 'Menu',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="Amigos" component={Amigos}
          options={{
            title: 'Amigos',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="Mapa" component={Mapa}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Login" component={Login}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}