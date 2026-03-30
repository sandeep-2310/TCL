import { NavLink } from 'react-router-dom';
import { Home, BookOpen, BookHeart, ShoppingCart, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/categories" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <BookOpen size={22} />
        <span>Books</span>
      </NavLink>
      <div className="nav-item">
        {/* Placeholder for verse of the day or similar modal/route */}
        <BookHeart size={22} />
        <span>Verse</span>
      </div>
      <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <ShoppingCart size={22} />
        <span>Cart</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
