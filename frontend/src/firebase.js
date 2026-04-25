import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Bin collection reference
export const binsCollection = collection(db, 'bins');
export const routesCollection = collection(db, 'routes');
export const analyticsCollection = collection(db, 'analytics');

// Helper functions
export const addBin = async (binData) => {
  try {
    const docRef = await addDoc(binsCollection, {
      ...binData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding bin:', error);
    throw error;
  }
};

export const getBins = async () => {
  try {
    const querySnapshot = await getDocs(binsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting bins:', error);
    throw error;
  }
};

export const updateBin = async (binId, updateData) => {
  try {
    const binRef = doc(db, 'bins', binId);
    await updateDoc(binRef, {
      ...updateData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating bin:', error);
    throw error;
  }
};

export const addRoute = async (routeData) => {
  try {
    const docRef = await addDoc(routesCollection, {
      ...routeData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding route:', error);
    throw error;
  }
};

export const getRoutes = async () => {
  try {
    const querySnapshot = await getDocs(routesCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting routes:', error);
    throw error;
  }
};
