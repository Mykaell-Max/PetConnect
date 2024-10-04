const {initializeApp} = require("firebase/app");

const firebaseConfig = {
    apiKey: global.env.FIREBASE_KEY,
    authDomain: "petconnect-1bd6a.firebaseapp.com",
    projectId: "petconnect-1bd6a",
    storageBucket: "petconnect-1bd6a.appspot.com",
    messagingSenderId: "668047922596",
    appId: "1:668047922596:web:edd17b687805f66f705d31",
    measurementId: "G-VHRTMP6950"
};

const firebaseApp = initializeApp(firebaseConfig);

module.exports = {firebaseApp};