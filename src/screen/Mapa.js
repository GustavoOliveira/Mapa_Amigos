import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, TextInput, Button, KeyboardAvoidingView, SafeAreaView, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as PessoasService from '../service/PessoasService'

export default function App() {

  const [pesquisatxt, setPesquisaTxt] = useState("")
  const [pesquisa, setPesquisa] = useState(null)
  const [myPosition, seMyposition] = useState(null)
  const [pessoas, setPessoas] = useState([])

  // Posição da IMED
  const [localicaoAtual, setLocalicaoAtual] = useState({
    latitude: -28.2653573,
    longitude: -52.3996577,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010,
  })

  const [localizacoes, setLocalizacoes] = useState([])


  const getMyPosition = async () => {
    let { status } = await Location.requestPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permissão de acesso a localização negado!")
    } else {
      await Location.getCurrentPositionAsync({enableHighAccuracy: true})
        .then(retorno => seMyposition(retorno.coords))
        .catch(error => Alert.alert("Erro ao acessar o GPS!"))
        // .catch(error => console.log(error))
    }
  }

  const getAmigosPosition = async () => {
    PessoasService.getPessoa()
      .then(retorno => {
        setPessoas(retorno)
        console.log(retorno)
        retorno.forEach(item => {
          console.log(item.nome)
          localizacoes.push({localicacao: {
            latitude: item.localicao.latitude,
            longitude: item.localicao.longitude,
            latitudeDelta: 0.010,
            longitudeDelta: 0.010,
          },
          title: item.nome,
          description: item.telefone,});
        });
      })
      .catch(erro => console.log(erro))
  }

  const pesquisaLatLong = async (endereco) => {
    let posicao = await Location.geocodeAsync(endereco)
      .then(resultado => {
        setPesquisa(resultado[0])
        console.log(resultado)
        setLocalicaoAtual({
          latitude: resultado[0].latitude,
          longitude: resultado[0].longitude,
          latitudeDelta: 0.010,
          longitudeDelta: 0.010,
        })
      })
      .catch(erro => console.log(erro))
  }

  useEffect(() => {
    getMyPosition()
    getAmigosPosition()
    
    // pesquisaLatLong("Prefeitura Municipal de Passo Fundo")

  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.boxmapa}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TextInput
            style={styles.caixaTexto}
            placeholder="Informe o local"
            value={pesquisatxt}
            onChangeText={text => setPesquisaTxt(text)}
          />

          <MapView
            style={styles.mapStyle}
            initialRegion={localicaoAtual}
            region={localicaoAtual}
          >
            {
              localizacoes.map((item, key) => <Marker
                key={key}
                coordinate={item.localicacao}
                title={item.title}
                description={item.description}
              />)
            }

            {myPosition ? <Marker
              coordinate={myPosition}
              title={"Onde eu estou!"}
              description={"Minha Casa"}
              image={require('../img/casa.png')}
            />

              : null}

            {pesquisa ? <Marker
              coordinate={pesquisa}
              title={"Pesquisa"}
              description={""}
            />

              : null}

          </MapView>

          <View style={styles.caixaBotao}>
            <TouchableOpacity style={styles.myLocationBox}
              onPress={() => {
                setLocalicaoAtual({
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                  latitudeDelta: 0.010,
                  longitudeDelta: 0.010,
                })
              }}
            >
              <Icon name="my-location" color={'#fff'} size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.myLocationBox}
              onPress={() => pesquisaLatLong(pesquisatxt)}
              // onPress={() => console.log(localizacoes)}
            >
              <Icon name="find-in-page" color={'#fff'} size={30} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      </View>
      <View style={styles.boxamigo}>
          <View>
          <FlatList style={{marginTop: 25}}
            data={pessoas}
            renderItem={({ item }) =>
              <TouchableOpacity
                onPress={() => {
                  // setLocalicaoAtual({
                  //   latitude: item.latitude,
                  //   longitude: item.longitude,
                  //   latitudeDelta: 0.010,
                  //   longitudeDelta: 0.010,
                  // })
                  pesquisaLatLong(item.cep)
                }}
              >
                <View style={styles.box}>
                  <View style={styles.boxCollum}>
                    <Text style={styles.boxTitle}>{item.nome}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caixaBotao: {
    flexDirection: 'row'
  },
  caixaTexto: {
    width: "95%",
    marginBottom: 10,
    marginTop: 25,
    marginLeft: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, mapStyle: {
    width: Dimensions.get('window').width,
    height: "100%"
  },
 
// botões localiza //
  positionBox: {
    marginTop: -170,
    marginHorizontal: 40,
    padding: 25
  },
  myLocationBox: {
    borderRadius: 150,
    width: 50,
    height: 50,
    marginTop: -130,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  // divide a tela//
  boxmapa: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    height : "70%",
  },boxamigo: {
    height: "30%",
    width : "100%",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 

  // flatlist amigos //
  box: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    padding: 10,
    marginTop: 3
  }, boxCollum: {
    width: "90%"
  },
  boxCollumAction: {
    width: "20%"
  },
  boxTitle: {
    fontWeight: "bold",
    color: "blue"
  }
});
