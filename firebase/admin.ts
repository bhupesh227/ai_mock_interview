
import {cert, getApps, initializeApp} from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
    const apps = getApps();
    if (!apps.length) {
      try {
        console.log("Initializing Firebase Admin SDK");
        const privateKey = process.env.FIREBASE_PRIVATE_KEY 
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
          : undefined;
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
        });
        console.log("Firebase Admin SDK initialized successfully");
      } catch (error) {
        console.error("Error initializing Firebase Admin:", error);
        throw error;
      }
      
    }else{
      console.log("Firebase Admin SDK already initialized");
    }
    const auth = getAuth();
    const db = getFirestore();
    
    return { auth, db };
}

export const { auth, db } = initFirebaseAdmin();