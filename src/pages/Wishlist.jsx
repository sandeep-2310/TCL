import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product); // Remove from wishlist after adding to cart
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="page-container fade-in text-center">
        <h2>My Wishlist</h2>
        <div className="empty-wishlist">
          <Heart size={64} className="empty-icon" />
          <h3>No saved items</h3>
          <p>You haven't saved any religious items to your wishlist yet.</p>
          <button className="btn-primary" style={{marginTop: '20px'}} onClick={() => navigate('/')}>
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in wishlist-page">
      <h2>My Wishlist ({wishlistItems.length})</h2>
      
      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <div className="wishlist-img-wrapper" onClick={() => navigate(`/product/${item.id}`)} style={{cursor: 'pointer'}}>
              <img src={item.imageUrl} alt={item.name} />
              <button 
                className="remove-wishlist-btn" 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                aria-label="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="wishlist-info">
              <span className="product-category">{item.category}</span>
              <h3 onClick={() => navigate(`/product/${item.id}`)} style={{cursor: 'pointer'}}>
                {item.name}
              </h3>
              <p className="price">₹{item.price}</p>
              <button 
                className="btn-primary move-cart-btn"
                onClick={() => handleMoveToCart(item)}
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
