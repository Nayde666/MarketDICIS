import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyC8_RGWZfZjPV1rrKf0HK7ZUPmXDs_n3ao",
  authDomain: "marketdicis.firebaseapp.com",
  projectId: "marketdicis",
  storageBucket: "marketdicis.appspot.com",
  messagingSenderId: "849001169887",
  appId: "1:849001169887:web:8575b506de095899b57a6a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;