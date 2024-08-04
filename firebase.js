// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvVJsfisup3gOvj3xF5jr1-VTVZPRcb9Q",
  authDomain: "inventory-management-f01a1.firebaseapp.com",
  projectId: "inventory-management-f01a1",
  storageBucket: "inventory-management-f01a1.appspot.com",
  messagingSenderId: "1085375533262",
  appId: "1:1085375533262:web:e0b895cd3cd19f52ce409f",
  measurementId: "G-355MG5QM00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export {firestore}