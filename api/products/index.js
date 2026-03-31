import { db, verifyAdmin } from '../_lib/init';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('products').get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      await verifyAdmin(req);
      const { name, category, price, description, imageUrl, stock } = req.body;
      
      const newProduct = {
        name,
        category,
        price: Number(price),
        description,
        image_url: imageUrl,
        stock: Number(stock),
        created_at: new Date().toISOString()
      };

      const docRef = await db.collection('products').add(newProduct);
      return res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error) {
      return res.status(error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500)
                .json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
