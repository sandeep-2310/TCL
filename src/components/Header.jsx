import { Menu, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <button className="menu-btn" aria-label="Menu">
        <Menu size={22} />
      </button>
      <Link to="/" className="header-brand">
        <div className="logo-round-wrap">
          <img src="/logo.png" alt="TCL" className="header-logo" />
        </div>
        <div className="header-title">
          <h1>TCL</h1>
          <p>Telugu Christian Literature</p>
        </div>
      </Link>
      <button className="theme-btn" aria-label="Toggle Theme">
        <Sun size={22} />
      </button>
    </header>
  );
};

export default Header;
