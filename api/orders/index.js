import { db, verifyAdmin } from '../_lib/init';
import admin from 'firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, isAdminView } = req.query;

  try {
    if (isAdminView === 'true') {
      // Admin View: Fetch ALL orders
      await verifyAdmin(req);
      const snapshot = await db.collection('orders').orderBy('created_at', 'desc').get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(orders);
    } else {
      // User View: Fetch specific user's orders
      if (!userId) return res.status(400).json({ error: 'User ID is required' });
      
      const snapshot = await db.collection('orders')
        .where('user_id', '==', userId)
        .orderBy('created_at', 'desc')
        .get();
        
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(orders);
    }
  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(error.message.includes('Unauthorized') ? 401 : 500).json({ error: error.message });
  }
}
