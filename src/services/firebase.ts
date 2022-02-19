import {initializeApp} from 'firebase/app';
import {GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged} from 'firebase/auth';
import {set, ref, getDatabase, onValue, push} from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const firebase = initializeApp(firebaseConfig);


export {signInWithPopup, set, push, onValue, ref, getDatabase , getAuth, firebase , GoogleAuthProvider, onAuthStateChanged};