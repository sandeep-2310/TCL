import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SplashScreen from './pages/SplashScreen';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import './App.css';

function App() {
  // Show splash screen only on the very first load of the session
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem('tcl_splash_seen');
    return !seen; // Show if not seen this session
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('tcl_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <Router>
      {/* Splash screen renders on top of everything on first load */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Routes>
        {/* Auth pages — no header/bottom nav */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main app with Layout (header + bottom nav) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
