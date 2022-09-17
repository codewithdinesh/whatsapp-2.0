import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBACToHFtqkPafvwZ4SStgD4oXaq1e_iyU",
    authDomain: "whatsapp-2o.firebaseapp.com",
    projectId: "whatsapp-2o",
    storageBucket: "whatsapp-2o.appspot.com",
    messagingSenderId: "923458965480",
    appId: "1:923458965480:web:667b77c65e0c8c0bddde5d",
    measurementId: "G-45QGK2VZMM"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()


export { auth, provider, db };

// export default db;

// https://youtu.be/svlEVg0To_c?t=3372


