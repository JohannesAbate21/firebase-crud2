import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase configuration here
  apiKey: 'AIzaSyCjYUIQtIGx5osC9vgNkIFz3v-iLqsI9PQ',
  authDomain: 'notes-242c0.firebaseapp.com',
  databaseURL: 'https://notes-242c0-default-rtdb.firebaseio.com',
  projectId: 'notes-242c0',
  storageBucket: 'notes-242c0.appspot.com',
  messagingSenderId: '378520659218',
  appId: '1:378520659218:web:6b991fbc66d4f1c0f43fcb',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
