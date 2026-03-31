import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq9zwgGqRuaLB2WAlaebDwWPhakjHwrCM",
  authDomain: "telugu-christian-literature.firebaseapp.com",
  projectId: "telugu-christian-literature",
  storageBucket: "telugu-christian-literature.firebasestorage.app",
  messagingSenderId: "252776633302",
  appId: "1:252776633302:web:63a643ffd814cda597ca77",
  measurementId: "G-HCDS7PC7W9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Optional: const analytics = getAnalytics(app);

// Keep our mock array as the seed data source
export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Comprehensive Study Bible (Telugu)',
    category: 'LITERATURE',
    price: 1250,
    description: 'Deep insights and cross-references for a profound understanding.',
    imageUrl: 'https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=400',
    badge: 'BEST SELLER',
    stock: 15
  },
  {
    id: 'p2',
    name: 'Sacred Serenity Jesus Frame',
    category: 'FRAMES',
    price: 800,
    description: 'A museum-quality art piece that brings a sense of peace.',
    imageUrl: 'https://images.unsplash.com/photo-1584888806282-53bba4b61aa4?auto=format&fit=crop&q=80&w=400',
    badge: null,
    stock: 5
  },
  {
    id: 'p3',
    name: 'Premium Wooden Cross',
    category: 'ACCESSORIES',
    price: 450,
    description: 'Handcrafted wooden cross, perfect for wall mounting.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: 'NEW',
    stock: 20
  }
];

// Helper to auto-seed Firestore if it is completely empty
const seedDatabaseIfEmpty = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    // If database is empty, push our mock objects into it!
    if (snapshot.empty) {
      console.log("Firestore is empty! Auto-seeding initial products...");
      for (const product of MOCK_PRODUCTS) {
        // Use the intended ID as the document ID
        const docRef = doc(db, "products", product.id);
        await setDoc(docRef, product);
      }
      console.log("Database successfully seeded.");
    }
  } catch (error) {
    console.warn("Failed to check or seed database. Make sure Firestore rules allow reading/writing.", error);
  }
};

// Start the seeder automatically
seedDatabaseIfEmpty();

// Fetch products from REAL Firestore collection
export const fetchProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) return MOCK_PRODUCTS; // Fallback to local if empty or rules fail silently
    
    const fetchedProducts = [];
    snapshot.forEach((doc) => {
      fetchedProducts.push({ id: doc.id, ...doc.data() });
    });
    return fetchedProducts;
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    // Silent fallback to keep UI running beautifully
    return MOCK_PRODUCTS; 
  }
};

// Create an order in REAL Firestore 'orders' collection
export const createOrder = async (orderData) => {
  try {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      throw new Error("Invalid order data");
    }
    
    // Add document to 'orders' collection
    const orderWithTimestamp = {
      ...orderData,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "orders"), orderWithTimestamp);
    
    return { success: true, orderId: docRef.id, timestamp: orderWithTimestamp.createdAt };
  } catch (error) {
    console.error("Error creating order in Firebase:", error);
    throw error;
  }
};

// Fetch user-specific orders
export const fetchUserOrders = async (userId) => {
  try {
    if (!userId) return [];
    
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    // If it's an index error, Firestore usually provides a link in the console
    return [];
  }
};
