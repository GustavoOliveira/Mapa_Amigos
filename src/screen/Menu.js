import React from 'react'
import { Button, StyleSheet, View } from 'react-native';

export default function App(props) {
    const { navigation } = props
    
    return (
        <View style={styles.container}>
            <View style={styles.botao}>
                <Button
                    style={{height:"100%"}}
                    title="Amigos"
                    onPress={() =>{navigation.navigate('Amigos')}}
                />
            </View>
    
            <View style={styles.botao}>
                <Button
                    style={{height:"100%"}}
                    title="Mapa"
                    onPress={() =>{navigation.navigate('Mapa')}}
                />
            </View>
        </View>
    );
  }
  
const styles = StyleSheet.create({
    botao: {
      marginTop: 10,
      height : 40,
      width : "95%",
    
      
    },container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
      }
  });