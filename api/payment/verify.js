import crypto from 'crypto';
import { db } from '../_lib/init';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    orderData 
  } = req.body;

  // 1. Verify Signature
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed: Invalid signature' });
  }

  // 2. Signature Verified! Save order to Firestore
  try {
    const finalOrder = {
      ...orderData,
      razorpay_order_id,
      razorpay_payment_id,
      payment_status: 'PAID',
      order_status: 'CONFIRMED',
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('orders').add(finalOrder);

    // 3. Optional: Decrease stock
    const batch = db.batch();
    for (const item of orderData.items) {
      const productRef = db.collection('products').doc(item.id);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.quantity)
      });
    }
    // await batch.commit(); // Only if products are fully managed in DB

    return res.status(200).json({ 
      success: true, 
      orderId: docRef.id,
      message: 'Payment verified and order saved successfully.' 
    });
  } catch (error) {
    console.error('Order saving error:', error);
    return res.status(500).json({ error: error.message });
  }
}
