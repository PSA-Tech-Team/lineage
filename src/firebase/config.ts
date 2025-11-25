import {initializeApp} from 'firebase/app';
import 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = { 
//   apiKey: process.env.NEXT_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
// };
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// try {
//   const app = firebase.initializeApp(firebaseConfig);
//   const db = getFirestore(app);
//   // if (process.env.NODE_ENV !== 'production') {
//   //   db.useEmulator('localhost', 8080);
//   // }
// } catch (e) {
//   console.error('Firebase initialization error', e);
// }

const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app)
export const db = getFirestore(app);

export const signInWithGoogle = async () => {
  // await auth.signInWithPopup(googleProvider);
  await signInWithPopup(auth, googleProvider);
}

export const signOut = async () => {
  await auth.signOut();
}
