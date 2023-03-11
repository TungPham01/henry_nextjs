// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNtqtUaAeo8zYFptIri7VgEKTUmIOSpIY",
  authDomain: "henry-nextjs-whatapp.firebaseapp.com",
  projectId: "henry-nextjs-whatapp",
  storageBucket: "henry-nextjs-whatapp.appspot.com",
  messagingSenderId: "230629832815",
  appId: "1:230629832815:web:d5cee1c2f2f9875c8af59a"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app)

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { db, auth, provider }
