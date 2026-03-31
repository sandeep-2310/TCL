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
    house: '',
    street: '',
    city: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    if (currentUser) {
      const addr = currentUser.addresses?.[0] || {};
      setFormData({
        name: currentUser.fullName || '',
        phone: currentUser.phone || '',
        house: addr.house || '',
        street: addr.street || '',
        city: addr.city || '',
        pincode: addr.pincode || ''
      });
    }
  }, [cartItems, currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Basic numeric constraint for phone and pincode
    if ((name === 'phone' || name === 'pincode') && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Indian Mobile: 10 digits, starts with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    // Pincode: 6 digits
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit Indian Pincode.";
    }

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.house.trim()) newErrors.house = "House/Flat No. is required.";
    if (!formData.street.trim()) newErrors.street = "Street/Area is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = getCartTotal();
      const fullAddress = `${formData.house}, ${formData.street}, ${formData.city} - ${formData.pincode}`;
      
      const orderData = {
        userId: currentUser?.uid || 'guest',
        customer_name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        })),
        total_price: totalAmount,
        payment_method: paymentMethod,
        order_status: 'PENDING',
        payment_status: 'PENDING'
      };

      if (paymentMethod === 'COD') {
        // Direct order creation for Cash on Delivery
        const result = await createOrder({ ...orderData, payment_status: 'UNPAID' });
        if (result.success) {
          clearCart();
          navigate(`/order-confirmation/${result.orderId}`);
        }
      } else {
        // Razorpay Payment Flow
        const resScript = await loadRazorpay();
        if (!resScript) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }

        // 1. Create Razorpay Order on Backend
        const orderResponse = await fetch('/api/payment/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount })
        });
        const razorpayOrder = await orderResponse.json();

        if (!razorpayOrder || !razorpayOrder.id) {
          throw new Error("Failed to create Razorpay order");
        }

        // 2. Open Razorpay Modal
        const options = {
          key: "rzp_test_YourKeyHere", // Replace with your Public Key ID
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Telugu Christian Literature",
          description: "Purchase Sacred Artifacts",
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              // 3. Verify Payment on Backend
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: { ...orderData, payment_method: 'RAZORPAY' }
                })
              });
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                clearCart();
                navigate(`/order-confirmation/${verifyData.orderId}`);
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              console.error("Verification failed", err);
              alert("Wait! Your payment was successful but we couldn't verify it. Our team will contact you.");
            }
          },
          prefill: {
            name: formData.name,
            contact: formData.phone
          },
          theme: { color: "#D4AF37" }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Order failed", error);
      alert("Something went wrong during checkout. Please try again.");
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
              placeholder="10-digit mobile number"
              required 
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>HOUSE / FLAT NO.</label>
              <input 
                type="text" 
                name="house" 
                value={formData.house} 
                onChange={handleInputChange} 
                required 
              />
              {errors.house && <span className="error-text">{errors.house}</span>}
            </div>
            <div className="form-group">
              <label>STREET / AREA</label>
              <input 
                type="text" 
                name="street" 
                value={formData.street} 
                onChange={handleInputChange} 
                required 
              />
              {errors.street && <span className="error-text">{errors.street}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CITY</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                required 
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label>PINCODE (INDIA)</label>
              <input 
                type="text" 
                name="pincode" 
                maxLength="6"
                placeholder="6 digits"
                value={formData.pincode} 
                onChange={handleInputChange} 
                required 
              />
              {errors.pincode && <span className="error-text">{errors.pincode}</span>}
            </div>
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
