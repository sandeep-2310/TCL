import './Categories.css';

const Categories = () => {
  return (
    <div className="page-container fade-in">
      <h2>All Categories</h2>
      <p className="page-subtitle">Browse our collection</p>
      
      <div className="categories-list">
        <div className="category-list-item">
          <div className="category-img" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542603842-7ea11bb0e9b6?auto=format&fit=crop&q=80&w=200")'}}></div>
          <div className="category-info">
            <h3>Holy Bibles</h3>
            <p>12 Items</p>
          </div>
        </div>
        <div className="category-list-item">
          <div className="category-img" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1582845607310-7aa843fa10ee?auto=format&fit=crop&q=80&w=200")'}}></div>
          <div className="category-info">
            <h3>Frames</h3>
            <p>24 Items</p>
          </div>
        </div>
        <div className="category-list-item">
          <div className="category-img" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1596728082404-b952a20b875c?auto=format&fit=crop&q=80&w=200")'}}></div>
          <div className="category-info">
            <h3>Key Chains</h3>
            <p>4 Items</p>
          </div>
        </div>
        <div className="category-list-item">
          <div className="category-img" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=200")'}}></div>
          <div className="category-info">
            <h3>Christmas Items</h3>
            <p>18 Items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
