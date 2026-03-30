import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../firebase';
import { CheckCircle, CreditCard, Wallet } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    if (currentUser) {
      setFormData({
        name: currentUser.fullName || '',
        phone: currentUser.phone || '',
        address: currentUser.addresses?.[0] 
          ? `${currentUser.addresses[0].house}, ${currentUser.addresses[0].street}, ${currentUser.addresses[0].city} - ${currentUser.addresses[0].pincode}`
          : ''
      });
    }
  }, [cartItems, currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        userId: currentUser?.uid || 'guest',
        items: cartItems,
        totalAmount: getCartTotal(),
        shippingInfo: formData,
        paymentMethod,
        status: 'PENDING'
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        clearCart();
        navigate(`/order-confirmation/${result.orderId}`);
      }
    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container fade-in checkout-page">
      <h2>Checkout</h2>
      
      <form onSubmit={handleCheckout} className="checkout-form">
        <section className="checkout-section">
          <h3>Shipping Details</h3>
          <div className="form-group">
            <label>FULL NAME</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>PHONE NUMBER</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>DELIVERY ADDRESS</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              rows="3" 
              required 
            ></textarea>
          </div>
        </section>

        <section className="checkout-section payment-section">
          <h3>Payment Method</h3>
          
          <div 
            className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('UPI')}
          >
            <div className="payment-icon"><Wallet size={20} /></div>
            <div className="payment-details">
              <h4>UPI (Google Pay, PhonePe)</h4>
              <p>Pay securely via UPI App</p>
            </div>
            <div className={`radio-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}></div>
          </div>

          <div 
            className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('COD')}
          >
            <div className="payment-icon"><CreditCard size={20} /></div>
            <div className="payment-details">
              <h4>Cash on Delivery</h4>
              <p>Pay when order arrives</p>
            </div>
            <div className={`radio-btn ${paymentMethod === 'COD' ? 'active' : ''}`}></div>
          </div>
        </section>

        <section className="checkout-summary">
          <div className="summary-row total">
            <span>Amount to Pay</span>
            <span>₹{getCartTotal()}</span>
          </div>
          <button 
            type="submit" 
            className="btn-primary place-order-btn" 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : `Place Order • ₹${getCartTotal()}`}
          </button>
        </section>
      </form>
    </div>
  );
};

export default Checkout;
