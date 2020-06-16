import { db } from '../back-end/firebase'

export const savePessoa = (pessoa, chave) => {

    if (chave === "") {
        return new Promise((resolve, reject) => {
            db.collection("pessoas")
                .add(pessoa)
                .then(result => resolve(result.id))
                .catch(erro => reject(erro))
        })
    } else {
        return new Promise((resolve, reject) => {
            db.collection("pessoas")
                .doc(chave)
                .update(pessoa)
                .then(() => resolve())
                .catch(erro => reject(erro))
        })
    }
}

export const deletePessoa = (pessoa) => {
    return new Promise((resolve, reject) => {
        db.collection("pessoas")
            .doc(pessoa.key)
            .delete()
            .then(() => resolve())
            .catch(erro => reject(erro))
    })
}

export const getPessoa = () => {
    return new Promise((resolve, reject) => {
        db.collection("pessoas")
            .get()
            .then(snapchot => {
                let pessoasLista = []
                snapchot.forEach((item) => {
                    //const { title, description } = item.data()
                    pessoasLista.push({
                        ...item.data(),
                        key: item.id
                    })
                })
                resolve(pessoasLista)
            })
            .catch(erro => reject(erro))
    })
}