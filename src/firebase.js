
import firebase from 'firebase';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyALz8GDr1y9-N7mYBz5h9iHd90wEkGdkdI",
    authDomain: "apparel-446c8.firebaseapp.com",
    databaseURL: "https://apparel-446c8.firebaseio.com",
    projectId: "apparel-446c8",
    storageBucket: "apparel-446c8.appspot.com",
    messagingSenderId: "260666043771"
   };

firebase.initializeApp(config);
const storage = firebase.storage();

export {
    storage, firebase as default
}