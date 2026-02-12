// src/firebase.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from "firebase/analytics"
import { getStorage } from "firebase/storage"  

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)  

// Initialize Analytics (optional)
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app)
  }
}).catch(e => console.error("Analytics error:", e))

// Enable offline persistence (optional)
// Removing this as it can cause issues in development
// enableIndexedDbPersistence(db).catch((err) => {
//   console.error("Firestore persistence error:", err.code);
// });

export { app, auth, db, storage, analytics } 