import { db, verifyAdmin } from '../_lib/init';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Verify Caller is Admin
    await verifyAdmin(req);

    const { order_status } = req.body;
    if (!order_status) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    // 2. Update Order Status in Firestore
    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await orderRef.update({
      order_status,
      updated_at: new Date().toISOString()
    });

    return res.status(200).json({ 
      success: true, 
      message: `Order status updated to ${order_status}`,
      orderId: id 
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500)
              .json({ error: error.message });
  }
}
