import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { fetchProducts } from '../firebase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      const allProducts = await fetchProducts();
      const found = allProducts.find(p => p.id === id);
      
      if (found) {
        setProduct(found);
        // Find 4 other products in the same category
        const related = allProducts
          .filter(p => p.category === found.category && p.id !== id)
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
      window.scrollTo(0, 0); // Reset scroll on product change
    };
    getProductData();
  }, [id]);

  if (loading) return <div className="page-container fade-in">Seeking sacred artifacts...</div>;
  if (!product) return <div className="page-container fade-in">Product not found.</div>;

  return (
    <div className="product-detail-page fade-in">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn"><ChevronLeft size={24} /></button>
        <div className="header-actions">
          <button className="share-btn"><Share2 size={20} /></button>
          <button 
            className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
            onClick={() => toggleWishlist(product)}
          >
            <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.name} className="main-image" />
        {product.badge && <span className="detail-badge">{product.badge}</span>}
      </div>

      <div className="product-content">
        <div className="category-tag">{product.category}</div>
        <h1 className="product-title">{product.name}</h1>
        
        <div className="rating-row">
          <div className="stars">
            <Star size={16} fill="#D4AF37" color="#D4AF37" />
            <Star size={16} fill="#D4AF37" color="#D4AF37" />
            <Star size={16} fill="#D4AF37" color="#D4AF37" />
            <Star size={16} fill="#D4AF37" color="#D4AF37" />
            <Star size={16} fill="#E0E0E0" color="#E0E0E0" />
          </div>
          <span className="reviews">(48 Reviews)</span>
        </div>

        <div className="price-row">
          <span className="current-price">₹{product.price}</span>
          <span className="mrp">₹{Math.round(product.price * 1.2)}</span>
          <span className="discount">20% OFF</span>
        </div>

        <div className="description-section">
          <h3>Description</h3>
          <p>{product.description}</p>
          <p className="extra-desc">
            This premium religious artifact is carefully curated to bring peace and spiritual growth 
            to your home. Hand-selected for the Telugu Christian Literature community.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <span>Blessed Item</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🚚</div>
            <span>Fast Shipping</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💎</div>
            <span>High Quality</span>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h3>Suggested for You</h3>
            <div className="related-grid">
              {relatedProducts.map(rp => (
                <div 
                  key={rp.id} 
                  className="related-item"
                  onClick={() => navigate(`/product/${rp.id}`)}
                >
                  <img src={rp.imageUrl} alt={rp.name} />
                  <div className="related-info">
                    <h4>{rp.name}</h4>
                    <p>₹{rp.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky-footer">
        <button className="add-to-cart-full" onClick={() => addToCart(product)}>
          <ShoppingCart size={20} />
          Add to Cart
        </button>
        <button className="buy-now-btn" onClick={() => { addToCart(product); navigate('/checkout'); }}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
