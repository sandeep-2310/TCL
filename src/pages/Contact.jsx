import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, MessageSquare, MapPin, Clock, ExternalLink } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open('https://wa.me/919988776655', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@tcl.com';
  };

  const handleCall = () => {
    window.location.href = 'tel:+919988776655';
  };

  return (
    <div className="contact-page page-container fade-in">
      <div className="contact-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h2>Contact & Location</h2>
      </div>

      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=600" 
          alt="TCL Store" 
          className="contact-hero-img" 
        />
        <div className="contact-badge">OFFICIAL STORE</div>
      </div>

      <div className="contact-content">
        <div className="owner-section">
          <div className="avatar-large">⛪</div>
          <h1>Telugu Christian Literature</h1>
          <p className="owner-subtitle">A Blessed Bookstore & Resource Center</p>
        </div>

        <div className="contact-methods">
          <button className="contact-card" onClick={handleCall}>
            <div className="contact-icon-wrap phone">
              <Phone size={20} />
            </div>
            <div className="contact-details">
              <span>Call Us</span>
              <strong>+91 99887 76655</strong>
            </div>
          </button>

          <button className="contact-card" onClick={handleWhatsApp}>
            <div className="contact-icon-wrap whatsapp">
              <MessageSquare size={20} />
            </div>
            <div className="contact-details">
              <span>WhatsApp</span>
              <strong>Message our team</strong>
            </div>
          </button>

          <button className="contact-card" onClick={handleEmail}>
            <div className="contact-icon-wrap email">
              <Mail size={20} />
            </div>
            <div className="contact-details">
              <span>Email</span>
              <strong>support@tcl.com</strong>
            </div>
          </button>
        </div>

        <div className="location-section">
          <div className="section-title-row">
            <MapPin size={18} className="icon-gold" />
            <h3>Our Physical Store</h3>
          </div>
          
          <div className="store-location-card">
            <div className="location-info">
              <h4>Main Road Branch</h4>
              <p>12-45, Market Street, Kakinada,</p>
              <p>Andhra Pradesh, 533001, India.</p>
              
              <div className="store-hours">
                <Clock size={14} />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
            <button className="map-btn" onClick={() => window.open('https://maps.google.com', '_blank')}>
              Open Maps <ExternalLink size={14} />
            </button>
          </div>
        </div>

        <div className="location-cta">
          <p>Visit us for a wider collection of sacred books, frames, and exclusive Christian artifacts.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
