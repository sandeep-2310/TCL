import { db, verifyAdmin } from '../_lib/init';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      await verifyAdmin(req);
      const updates = req.body;
      delete updates.id; // Protect ID from change
      
      await db.collection('products').doc(id).update({
        ...updates,
        updated_at: new Date().toISOString()
      });
      return res.status(200).json({ id, ...updates });
    } catch (error) {
       return res.status(error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500)
                .json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await verifyAdmin(req);
      await db.collection('products').doc(id).delete();
      return res.status(200).json({ message: 'Product deleted successfully', id });
    } catch (error) {
       return res.status(error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500)
                .json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
