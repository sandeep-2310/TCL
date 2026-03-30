import { Search, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../firebase';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };
  return (
    <div className="home-page fade-in">
      {/* Banner Section */}
      <section className="welcome-banner">
        <div className="banner-bg"></div>
        <div className="banner-content">
          <h1>Welcome to<br/>TELUGU CHRISTIAN<br/>LITERATURE</h1>
          <p>Serving Faith with Love</p>
          <p className="banner-subtext">Discover a curated collection of spiritual wisdom and sacred artifacts designed to illuminate your path and strengthen your devotion.</p>
          <div className="banner-buttons">
            <button className="btn-primary">Explore Collection</button>
            <button className="btn-secondary">Our Mission</button>
          </div>
        </div>
      </section>

      {/* Verse of the day */}
      <section className="verse-section">
        <div className="verse-card">
          <div className="verse-header">
            <span>VERSE OF THE DAY</span>
            <span className="stars">✨</span>
          </div>
          <p className="verse-text">
            "యెహోవా నా కాపరి, నాకు లేమి కలుగదు. పచ్చిక గల చోట్ల ఆయన నన్ను పరుండజేయుచున్నాడు."
          </p>
          <p className="verse-ref">— కీర్తనలు (Psalms) 23:1-2</p>
          <div className="verse-actions">
            <button>Share Word</button>
            <button>Save</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <button className="view-all">View All <ChevronRight size={16} /></button>
        </div>
        <div className="categories-grid">
          <div className="category-card" style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=300")'}}>
            <h3>Bibles</h3>
            <p>Telugu & English ➔</p>
          </div>
          <div className="category-card" style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1582845607310-7aa843fa10ee?auto=format&fit=crop&q=80&w=300")'}}>
            <h3>Frames</h3>
            <p>Sacred Art ➔</p>
          </div>
          <div className="category-card" style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=300")'}}>
            <h3>Key Chains</h3>
            <p>Holy Reminders ➔</p>
          </div>
          <div className="category-card" style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=300")'}}>
            <h3>Christmas</h3>
            <p>Seasonal Joy ➔</p>
          </div>
        </div>
      </section>

      {/* Best-Selling */}
      <section className="bestselling-section">
        <div className="section-header center">
          <h2>Best-Selling Religious Items</h2>
          <p>Chosen by our community for spiritual growth</p>
        </div>
        <div className="product-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Loading divine artifacts...
            </div>
          ) : (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                {product.badge && <div className="product-badge">{product.badge}</div>}
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <span className="price">₹{product.price}</span>
                    <button 
                      className="add-cart-btn" 
                      onClick={() => handleAddToCart(product)}
                      aria-label="Add to cart"
                    >🛒</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="home-footer">
        <div className="logo-icon">⛪</div>
        <p>"Light to your path, Hope for your heart."</p>
        <p className="copyright">© 2024 Telugu Christian Literature. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
