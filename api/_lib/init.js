import admin from 'firebase-admin';
import Razorpay from 'razorpay';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

// Initialize Razorpay
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const verifyAdmin = async (req) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) throw new Error('Unauthorized: No token provided');
  
  const decodedToken = await admin.auth().verifyIdToken(token);
  const userRef = db.collection('users').doc(decodedToken.uid);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return decodedToken;
};
