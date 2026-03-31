import { ChevronRight } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Holy Bibles',
      count: '12 Items',
      image: 'https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 2,
      name: 'Sacred Frames',
      count: '24 Items',
      image: 'https://images.unsplash.com/photo-1582845607310-7aa843fa10ee?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 3,
      name: 'Holy Keychains',
      count: '8 Items',
      image: 'https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 4,
      name: 'Christmas Joy',
      count: '32 Items',
      image: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 5,
      name: 'Prayer Books',
      count: '15 Items',
      image: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=200'
    }
  ];

  return (
    <div className="categories-page page-container fade-in">
      <h2>All Categories</h2>
      <p className="page-subtitle">Browse our sacred collection</p>
      
      <div className="categories-list">
        {categories.map((cat) => (
          <div className="category-list-item" key={cat.id}>
            <div 
              className="category-img" 
              style={{backgroundImage: `url("${cat.image}")`}}
            />
            <div className="category-info">
              <h3>{cat.name}</h3>
              <p>{cat.count}</p>
            </div>
            <div className="category-arrow">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
