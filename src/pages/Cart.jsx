import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="page-container fade-in text-center">
        <h2>Your Cart</h2>
        <div className="empty-cart">
          <ShoppingCart size={64} className="empty-cart-icon" />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any religious items to your cart yet.</p>
          <button className="btn-primary" style={{marginTop: '20px'}} onClick={() => navigate('/')}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in cart-page">
      <h2>Your Cart</h2>
      
      <div className="cart-items-list">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-price">₹{item.price}</p>
              
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16}/></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16}/></button>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{getCartTotal()}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{getCartTotal()}</span>
        </div>
        <button 
          className="btn-primary checkout-btn" 
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
