import { Menu, Sun } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <button className="menu-btn" aria-label="Menu">
        <Menu size={24} />
      </button>
      <div className="header-title">
        <h1>TELUGU CHRISTIAN</h1>
        <h2>LITERATURE</h2>
      </div>
      <button className="theme-btn" aria-label="Toggle Theme">
        <Sun size={24} />
      </button>
    </header>
  );
};

export default Header;
