import { Search, ChevronRight, Heart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../firebase';
import { useWishlist } from '../context/WishlistContext';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Read category from query params: /?category=LITERATURE
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      
      if (categoryFilter) {
        setFilteredProducts(data.filter(p => p.category.toUpperCase() === categoryFilter.toUpperCase()));
      } else {
        setFilteredProducts(data);
      }
      setLoading(false);
    };
    loadProducts();
  }, [categoryFilter]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredProducts(categoryFilter 
        ? products.filter(p => p.category.toUpperCase() === categoryFilter.toUpperCase())
        : products
      );
    } else {
      setFilteredProducts(products.filter(p => 
        (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)) &&
        (!categoryFilter || p.category.toUpperCase() === categoryFilter.toUpperCase())
      ));
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const clearFilter = () => {
    setSearchQuery('');
    navigate('/');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            <button className="btn-primary" onClick={() => scrollToSection('categories')}>Explore Collection</button>
            <button className="btn-secondary" onClick={() => scrollToSection('mission')}>Our Mission</button>
          </div>
        </div>
      </section>

      {/* Our Mission / Verses Section */}
      <section className="mission-section" id="mission">
        <div className="section-header center">
          <h2>Our Holy Mission</h2>
          <p>Spreading the word of God in the language of the heart.</p>
        </div>
        <div className="verses-grid">
          <div className="verse-card-mission">
            <div className="verse-icon">📖</div>
            <h3>Faith in Action</h3>
            <p>"దేవుడు లోకమును ఎంతో ప్రేమించెను... ఆయనను విశ్వసించు ప్రతివాడును నశింపక నిత్యజీవము పొందును."</p>
            <p className="verse-ref-mission">— యోహాను (John) 3:16</p>
          </div>
          <div className="verse-card-mission">
            <div className="verse-icon">🛡️</div>
            <h3>God's Protection</h3>
            <p>"యెహోవా నా కాపరి, నాకు లేమి కలుగదు. పచ్చిక గల చోట్ల ఆయన నన్ను పరుండజేయుచున్నాడు."</p>
            <p className="verse-ref-mission">— కీర్తనలు (Psalms) 23:1-2</p>
          </div>
          <div className="verse-card-mission">
            <div className="verse-icon">🕯️</div>
            <h3>Word as Light</h3>
            <p>"నీ వాక్యము నా పాదములకు దీపమును నా త్రోవకు వెలుగునై యున్నది."</p>
            <p className="verse-ref-mission">— కీర్తనలు (Psalms) 119:105</p>
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

      {/* Search Bar */}
      <section className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search Bibles, frames, accessories..." 
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" id="categories">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <button className="view-all" onClick={() => navigate('/categories')}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="categories-grid">
          <div 
            className="category-card" 
            style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=300")'}}
            onClick={() => navigate('/?category=LITERATURE')}
          >
            <h3>Bibles</h3>
            <p>Telugu & English ➔</p>
          </div>
          <div 
            className="category-card" 
            style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1582845607310-7aa843fa10ee?auto=format&fit=crop&q=80&w=300")'}}
            onClick={() => navigate('/?category=FRAMES')}
          >
            <h3>Frames</h3>
            <p>Sacred Art ➔</p>
          </div>
          <div 
            className="category-card" 
            style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=300")'}}
            onClick={() => navigate('/?category=ACCESSORIES')}
          >
            <h3>Key Chains</h3>
            <p>Holy Reminders ➔</p>
          </div>
          <div 
            className="category-card" 
            style={{backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=300")'}}
            onClick={() => navigate('/?category=CHRISTMAS')}
          >
            <h3>Christmas</h3>
            <p>Seasonal Joy ➔</p>
          </div>
        </div>
      </section>

      {/* Best-Selling */}
      <section className="bestselling-section">
        <div className="section-header center">
          <h2>
            {categoryFilter ? `${categoryFilter.charAt(0) + categoryFilter.slice(1).toLowerCase()} Collection` : 'Best-Selling Religious Items'}
          </h2>
          <p>Chosen by our community for spiritual growth</p>
          {categoryFilter && (
            <button className="clear-filter-pill" onClick={clearFilter}>
              {categoryFilter} <X size={14} />
            </button>
          )}
        </div>
        <div className="product-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Loading divine artifacts...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', width: '100%' }}>
              No products found matching "{searchQuery}"
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                {product.badge && <div className="product-badge">{product.badge}</div>}
                <button 
                  className={`wishlist-toggle ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  onClick={() => navigate(`/product/${product.id}`)} 
                  style={{cursor: 'pointer'}} 
                />
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                    {product.name}
                  </h3>
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
