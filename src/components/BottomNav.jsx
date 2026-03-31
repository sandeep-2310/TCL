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
      <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <BookHeart size={22} />
        <span>Saved</span>
      </NavLink>
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
