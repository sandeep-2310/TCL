// This file acts as an API Service layer.
// Under real implementation, it uses Firebase Auth and Firestore.
// Since no config is provided, it simulates Firestore collections and delays.

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

// Simulates fetching products from Firestore
export const fetchProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 600);
  });
};

// Simulates creating an order document in Firestore
export const createOrder = async (orderData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!orderData || !orderData.items || orderData.items.length === 0) {
        reject(new Error("Invalid order data"));
        return;
      }
      // Simulate success with order ID
      const orderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
      resolve({ success: true, orderId, timestamp: new Date().toISOString() });
    }, 1500);
  });
};
