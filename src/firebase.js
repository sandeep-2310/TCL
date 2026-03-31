import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  doc, 
  setDoc, 
  updateDoc,
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
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

// Expanded mock data with 24 premium items (6 per category)
export const MOCK_PRODUCTS = [
  // HOLY BIBLES (LITERATURE) - 6 Items
  {
    id: 'bible-1',
    name: 'Telugu Study Bible - Premium Leather',
    category: 'LITERATURE',
    price: 1850,
    description: 'Gold-edged premium leather bound Telugu Study Bible with exhaustive cross-references.',
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=400',
    badge: 'BEST SELLER',
    stock: 25
  },
  {
    id: 'bible-2',
    name: 'Parallel Bible (Telugu - English)',
    category: 'LITERATURE',
    price: 1200,
    description: 'Perfect for study, featuring Telugu and English KJV side-by-side.',
    imageUrl: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=400',
    badge: 'POPULAR',
    stock: 40
  },
  {
    id: 'bible-3',
    name: 'Children\'s Illustrated Telugu Bible',
    category: 'LITERATURE',
    price: 650,
    description: 'Beautifully illustrated Bible stories for children in simple Telugu.',
    imageUrl: 'https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=400',
    badge: 'KIDS',
    stock: 50
  },
  {
    id: 'bible-4',
    name: 'The Living Word - Youth Edition',
    category: 'LITERATURE',
    price: 850,
    description: 'Modern Telugu translation designed for youth with practical life applications.',
    imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&q=80&w=400',
    badge: 'NEW',
    stock: 35
  },
  {
    id: 'bible-5',
    name: 'Large Print Telugu Bible',
    category: 'LITERATURE',
    price: 950,
    description: 'Easy-to-read large font Telugu Bible, ideal for seniors.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400',
    badge: 'COMFORT',
    stock: 20
  },
  {
    id: 'bible-6',
    name: 'Pocket-Size Telugu New Testament',
    category: 'LITERATURE',
    price: 150,
    description: 'Compact New Testament for carrying God\'s word wherever you go.',
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=400',
    badge: 'TRAVEL',
    stock: 100
  },

  // SACRED FRAMES (FRAMES) - 6 Items
  {
    id: 'frame-1',
    name: 'The Last Supper - Golden Carved Frame',
    category: 'FRAMES',
    price: 2400,
    description: 'Large 24x18 inch 3D carved frame of The Last Supper with golden finish.',
    imageUrl: 'https://images.unsplash.com/photo-1582845607310-7aa843fa10ee?auto=format&fit=crop&q=80&w=400',
    badge: 'PREMIUM',
    stock: 10
  },
  {
    id: 'frame-2',
    name: 'Blessing of the Home - Telugu Calligraphy',
    category: 'FRAMES',
    price: 1200,
    description: 'Elegant glass frame featuring "In this house, we serve the Lord" in Telugu.',
    imageUrl: 'https://images.unsplash.com/photo-1584888806282-53bba4b61aa4?auto=format&fit=crop&q=80&w=400',
    badge: 'TOP CHOICE',
    stock: 15
  },
  {
    id: 'frame-3',
    name: 'Good Shepherd (Jesus) Canvas Frame',
    category: 'FRAMES',
    price: 950,
    description: 'High-quality canvas print of Jesus as the Good Shepherd in a durable frame.',
    imageUrl: 'https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=400',
    badge: null,
    stock: 20
  },
  {
    id: 'frame-4',
    name: 'Psalm 23 Wall Art - Modern Minimalist',
    category: 'FRAMES',
    price: 750,
    description: 'Modern minimalist design of Psalm 23 in Telugu on high-grade paper with a sleek black frame.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
    badge: 'MODERN',
    stock: 30
  },
  {
    id: 'frame-5',
    name: '10 Commandments - Stone Look Frame',
    category: 'FRAMES',
    price: 1500,
    description: 'Unique stone-textured frame featuring the Ten Commandments in Telugu.',
    imageUrl: 'https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=400',
    badge: null,
    stock: 12
  },
  {
    id: 'frame-6',
    name: 'Resurrection Joy - Stained Glass Look',
    category: 'FRAMES',
    price: 1100,
    description: 'Beautiful acrylic frame with a stained-glass effect depicting the Resurrection.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
    badge: 'ART',
    stock: 18
  },

  // HOLY ACCESSORIES (KEYCHAINS) - 6 Items
  {
    id: 'key-1',
    name: 'Metallic Cross Keychain - Silver',
    category: 'ACCESSORIES',
    price: 150,
    description: 'Sturdy stainless steel cross keychain with polished silver finish.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: 'NEW',
    stock: 100
  },
  {
    id: 'key-2',
    name: 'Philippians 4:13 Tag Keychain',
    category: 'ACCESSORIES',
    price: 180,
    description: 'Engraved metallic tag with "I can do all things through Christ" in Telugu.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: 'TRENDING',
    stock: 80
  },
  {
    id: 'key-3',
    name: 'Peace Dove Wooden Keychain',
    category: 'ACCESSORIES',
    price: 120,
    description: 'Handcrafted rosewood keychain in the shape of a peace dove.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: null,
    stock: 200
  },
  {
    id: 'key-4',
    name: 'Leather Strap "Jesus" Keychain',
    category: 'ACCESSORIES',
    price: 220,
    description: 'Premium brown leather strap keychain with embossed name of Jesus.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: 'LEATHER',
    stock: 50
  },
  {
    id: 'key-5',
    name: 'Glowing Cross - Neon Keychain',
    category: 'ACCESSORIES',
    price: 250,
    description: 'Glow-in-the-dark acrylic cross keychain, perfect for finding keys at night.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: 'Glow',
    stock: 60
  },
  {
    id: 'key-6',
    name: 'Bible Verse Rotating Cube Keychain',
    category: 'ACCESSORIES',
    price: 300,
    description: 'Rotating cube keychain with 4 different Bible verses on each side.',
    imageUrl: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=400',
    badge: 'UNIQUE',
    stock: 45
  },

  // CHRISTMAS JOY (CHRISTMAS) - 6 Items
  {
    id: 'xmas-1',
    name: 'Nativity Set - 12 Piece Deluxe',
    category: 'CHRISTMAS',
    price: 3500,
    description: 'Exquisite 12-piece nativity scene handcrafted from high-quality resin.',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=400',
    badge: 'SEASONAL',
    stock: 8
  },
  {
    id: 'xmas-2',
    name: 'Angel Gabriel Tree Topper',
    category: 'CHRISTMAS',
    price: 850,
    description: 'Illuminated 12-inch angel tree topper for your Christmas celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1576692139735-b04e9c73df41?auto=format&fit=crop&q=80&w=400',
    badge: 'TOP SELLER',
    stock: 30
  },
  {
    id: 'xmas-3',
    name: 'Bible Verse Xmas Bauble Set (6pcs)',
    category: 'CHRISTMAS',
    price: 450,
    description: 'Set of 6 Christmas tree baubles featuring Christmas-themed Bible verses in Telugu.',
    imageUrl: 'https://images.unsplash.com/photo-1512474932049-7826d6909550?auto=format&fit=crop&q=80&w=400',
    badge: null,
    stock: 60
  },
  {
    id: 'xmas-4',
    name: 'Hand-Painted Star of Bethlehem',
    category: 'CHRISTMAS',
    price: 350,
    description: 'Ceramic hand-painted star ornament with "For Unto Us a Child is Born" text.',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=400',
    badge: null,
    stock: 120
  },
  {
    id: 'xmas-5',
    name: 'Wooden Stable - DIY Nativity Kit',
    category: 'CHRISTMAS',
    price: 1200,
    description: 'Hand-cut wooden stable kit for building your own nativity scene at home.',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=400',
    badge: 'LIMITED',
    stock: 15
  },
  {
    id: 'xmas-6',
    name: 'Christmas advent Candle Set (4pcs)',
    category: 'CHRISTMAS',
    price: 600,
    description: 'Set of 4 advent candles representing Hope, Peace, Joy, and Love.',
    imageUrl: 'https://images.unsplash.com/photo-1576692139735-b04e9c73df41?auto=format&fit=crop&q=80&w=400',
    badge: 'FAITH',
    stock: 40
  }
];

// Helper to auto-seed Firestore if it is completely empty
const seedDatabaseIfEmpty = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log("Firestore is empty! Auto-seeding initial products...");
      for (const product of MOCK_PRODUCTS) {
        const docRef = doc(db, "products", product.id);
        await setDoc(docRef, product);
      }
      console.log("Database successfully seeded.");
    }
  } catch (error) {
    console.warn("Failed to check or seed database.", error);
  }
};

seedDatabaseIfEmpty();

// User data updates
export const updateUserData = async (userId, data) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// Fetch products from REAL Firestore collection
export const fetchProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) return MOCK_PRODUCTS;
    const fetchedProducts = [];
    snapshot.forEach((doc) => {
      fetchedProducts.push({ id: doc.id, ...doc.data() });
    });
    return fetchedProducts;
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    return MOCK_PRODUCTS; 
  }
};

// Create an order in REAL Firestore 'orders' collection
export const createOrder = async (orderData) => {
  try {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      throw new Error("Invalid order data");
    }
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
    return [];
  }
};
