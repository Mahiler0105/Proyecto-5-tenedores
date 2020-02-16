import firebase from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyDjyVVsUg3UsuRQ1h33eMDcgXBMpnFLXBo",
    authDomain: "cincotenedores-73d3b.firebaseapp.com",
    databaseURL: "https://cincotenedores-73d3b.firebaseio.com",
    projectId: "cincotenedores-73d3b",
    storageBucket: "cincotenedores-73d3b.appspot.com",
    messagingSenderId: "12494859528",
    appId: "1:12494859528:web:55bbff87e19a04f56f10bd"
  };

  export const firebaseApp = firebase.initializeApp(firebaseConfig);