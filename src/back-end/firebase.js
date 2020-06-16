import * as firebase from "firebase"
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyANBjVGOY6Dhay6jN9bd_1WoFGZ-rAc1BM",
    authDomain: "workreminder-c6a45.firebaseapp.com",
    databaseURL: "https://workreminder-c6a45.firebaseio.com",
    projectId: "workreminder-c6a45",
    storageBucket: "workreminder-c6a45.appspot.com",
    messagingSenderId: "785469905479",
    appId: "1:785469905479:web:5287b2fea3275acbf8ef62",
    measurementId: "G-3S07N463QX"
};

const firebaseApp = firebase.app.length > 0 ?
    firebase.initializeApp(firebaseConfig)
    :
    firebase.app()

const db = firebaseApp.firestore()
//export default db;
export { db, firebase }


