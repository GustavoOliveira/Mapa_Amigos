import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import * as PessoasService from '../service/PessoasService'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import { not } from 'react-native-reanimated';

export default function App() {

  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")

  const [key, setKey] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [pessoas, setPessoas] = useState([])
  const [loading, setLoaging] = useState(false)
  const [localicao, setLocalicao] = useState([])

  const getEndereco = async (cordenadas) => {
    console.log(cordenadas)
    let enderecoCompl = await Location.reverseGeocodeAsync(cordenadas)
        .then(resultado => {
          console.log(resultado)
        })
        .catch(erro => console.log(erro))
  }

  const pesquisaLatLong = async (endereco) => {
    if (!cep){
       console.log("teste")
    }
    else{
      let posicao = await Location.geocodeAsync(endereco)
        .then(resultado => {
          console.log(resultado)
          setLocalicao({
            latitude: resultado[0].latitude,
            longitude: resultado[0].longitude,
            latitudeDelta: 0.010,
            longitudeDelta: 0.010,
          })
        })
        .catch(erro => console.log(erro))
        // getEndereco(localicao)
    }
  }


  const limparDados = () => {
    setNome("")
    setTelefone("")
    setCep("")
    setEndereco("")

    setMensagem("")
    setKey("")
    setLocalicao([])
  }

  const savePessoa = () => {
    console.log(localicao)
    if (localicao.length <= 0) {
      setMensagem("Verifique o CEP")
    } else {
      const pessoa = {
        nome: nome,
        telefone: telefone,
        cep : cep,
        endereco: endereco,
        localicao : localicao
      }

      PessoasService.savePessoa(pessoa, key)
        .then(res => {
          setMensagem("Dados Inseridos com Sucesso!")
          limparDados()
          getPessoas()
        })
        .catch(erro => setMensagem(erro))
    }
  }

  const deletePessoa = (pessoa) => {
    setLoaging(true)
    PessoasService.deletePessoa(pessoa)
      .then(() => getPessoas())
      .catch(erro => setMensagem(erro))
  }

  const getPessoas = () => {
    setLoaging(true)
    PessoasService.getPessoa()
      .then(retorno => {
        console.log(retorno)
        setPessoas(retorno)
        setLoaging(false)
      })
      .catch(erro => setMensagem(erro))
  }

  useEffect(() => {
    getPessoas()
  }, [])

  return (
    <View style={styles.container}>
      <Text>{mensagem}</Text>
      <TextInput
        style={nome ? styles.caixaTexto : styles.caixaTextoError}
        placeholder='Nome'
        value={nome}
        onChangeText={texto => setNome(texto)}
      />
      <TextInput
        style={telefone ? styles.caixaTexto : styles.caixaTextoError}
        placeholder='Telefone'
        value={telefone}
        onChangeText={texto => setTelefone(texto)}
      />
      <View style={styles.boxCep}>
      <TextInput
        style={cep ? styles.caixaTextoCEP : styles.caixaTextoErrorCEP}
        placeholder='Cep'
        value={cep}
        onChangeText={texto => setCep(texto)}
        
      />
      <Icon style={styles.iconCEP}
                      onPress={() => pesquisaLatLong(cep)}
                      name="search"
                      size={30} color="red" />
      </View>
      
      <TextInput
        style={endereco ? styles.caixaTexto : styles.caixaTextoError}
        placeholder='Endereço'
        value={endereco}
        onChangeText={texto => setEndereco(texto)}
      />


      <View style={styles.caixaBotao}>
        <View style={styles.botao}>
          <Button
            title="Salvar"
            onPress={savePessoa}
          />
        </View>
        <View style={styles.botao}>
          <Button
            title="Limpar Dados"
            onPress={limparDados}
          />
        </View>
      </View>

      <View>
        <ActivityIndicator animating={loading} size="small" color="#00ff00" />
        <FlatList
          data={pessoas}
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() => {
                setNome(item.nome)
                setTelefone(item.telefone)
                setCep(item.cep)
                setEndereco(item.endereco)
                setKey(item.key)
              }}
            >
              <View style={styles.box}>
                <View style={styles.boxCollum}>
                  <Text style={styles.boxTitle}>{item.nome}</Text>
                  <Text>{item.telefone}</Text>
                </View>
                <View style={styles.boxCollumAction}>
                  <Text>
                    <Icon
                      onPress={() => deletePessoa(item)}
                      name="trash"
                      size={30} color="red" />
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          }
        />
      </View>

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 10,

  }, caixaTexto: {
    width: "97%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    marginTop: 7
  }, caixaTextoError: {
    width: "97%",
    borderWidth: 1,
    borderColor: "red",
    padding: 5,
    marginTop: 7
  }, caixaBotao: {
    marginTop: 5,
    flexDirection: "row"
  },
  botao: {
    marginRight: 3
  }, caixaTextoCEP: {
    width: "90%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    marginRight : 10
  }, caixaTextoErrorCEP: {
    width: "90%",
    borderWidth: 1,
    borderColor: "red",
    padding: 5,
    marginRight : 10
  },
  mensagemErro: {
    color: "red",
    marginLeft: 20
  }, box: {
    flexDirection: "row",
    width: "95%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    padding: 10,
    marginTop: 10
  }, boxCollum: {
    width: "80%"
  },
  boxCollumAction: {
    width: "20%"
  },
  boxTitle: {
    fontWeight: "bold",
    color: "blue"
  }, boxCep: {
    flexDirection: "row",
    width: "95%",
    marginTop: 7
  }, iconCEP: {
    marginTop: 3
  }
});
