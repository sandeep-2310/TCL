import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const categories = [
    {
      id: 1,
      name: 'Holy Bibles',
      key: 'LITERATURE',
      count: 'Direct from Google Cloud',
      image: 'https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 2,
      name: 'Sacred Frames',
      key: 'FRAMES',
      count: 'Direct from Google Cloud',
      image: 'https://images.unsplash.com/photo-1582845607310-7aa843fa10ee?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 3,
      name: 'Holy Accessories',
      key: 'ACCESSORIES',
      count: 'Direct from Google Cloud',
      image: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 4,
      name: 'Christmas Joy',
      key: 'CHRISTMAS',
      count: 'Special Season',
      image: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const handleCategoryClick = (key) => {
    navigate(`/?category=${key}`);
  };

  return (
    <div className="categories-page page-container fade-in">
      <div className="categories-header">
        <h2>Sacred Collections</h2>
        <p className="page-subtitle">Curated categories for your spiritual growth</p>
      </div>
      
      <div className="categories-grid-primary">
        {categories.map((cat) => (
          <div 
            className="category-item-card" 
            key={cat.id} 
            onClick={() => handleCategoryClick(cat.key)}
            style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("${cat.image}")`}}
          >
            <div className="category-card-overlay">
              <h3>{cat.name}</h3>
              <div className="explore-badge">Explore ➔</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
