import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbG1CULLDuxzTwtGaj7TGpAVbop7E2cAI",
  authDomain: "finance-pro-a3a9f.firebaseapp.com",
  projectId: "finance-pro-a3a9f",
  storageBucket: "finance-pro-a3a9f.firebasestorage.app",
  messagingSenderId: "445397802662",
  appId: "1:445397802662:web:d2f6f0f1e2713c35c9de67"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);