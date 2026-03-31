import { User, MapPin, Heart, ShoppingBag, LogOut, HelpCircle, Mail, ChevronRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !currentUser) return <div className="page-container fade-in">Loading...</div>;

  // Show a "please sign in" card for anonymous (guest) users
  if (currentUser.isAnonymous) {
    return (
      <div className="profile-page fade-in">
        <div className="profile-header">
          <div className="profile-header-bg"></div>
          <div className="profile-greeting">
            <h2>Peace be with you,</h2>
            <h1>Visitor</h1>
            <p className="blessing">"For God so loved the world…" — John 3:16</p>
          </div>
        </div>
        <div className="profile-content">
          <div className="guest-card">
            <div className="guest-icon">🙏</div>
            <h3>Sign in to your account</h3>
            <p>Create an account or sign in to track your orders, save your wishlist, and manage your details.</p>
            <Link to="/login" className="btn-primary guest-btn" id="profile-login-btn">
              <LogIn size={18} /> Sign In
            </Link>
            <Link to="/register" className="btn-secondary guest-btn-outline" id="profile-register-btn">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page fade-in">
      <div className="profile-header">
        <div className="profile-header-bg"></div>
        <div className="profile-greeting">
          <h2>Peace be with you,</h2>
          <h1>{currentUser.fullName.split(' ')[0]}</h1>
          <p className="blessing">"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you."</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section personal-card">
          <div className="section-header">
            <h3>Personal Details</h3>
            <div className="icon-circle"><User size={18} /></div>
          </div>
          
          <div className="detail-item">
            <span className="label">FULL NAME</span>
            <p>{currentUser.fullName}</p>
          </div>
          <div className="detail-item">
            <span className="label">EMAIL ADDRESS</span>
            <p>{currentUser.email}</p>
          </div>
          <div className="detail-item borderless">
            <span className="label">PHONE NUMBER</span>
            <p>{currentUser.phone}</p>
          </div>
          
          <button className="btn-primary edit-profile-btn">Edit Profile</button>
        </div>

        <div className="profile-section address-card">
          <div className="section-header">
            <h3>Saved Address</h3>
            <div className="icon-circle"><MapPin size={18} /></div>
          </div>
          
          <div className="address-form">
            <div className="form-group">
              <label>HOUSE NUMBER</label>
              <input type="text" value="Flat 402, Zion Heights" readOnly />
            </div>
            <div className="form-group">
              <label>STREET</label>
              <input type="text" value="Gospel Lane, Banjara Hills" readOnly />
            </div>
            <div className="form-group">
              <label>CITY</label>
              <input type="text" value="Hyderabad" readOnly />
            </div>
            <div className="form-group">
              <label>PINCODE</label>
              <input type="text" value="500034" readOnly />
            </div>
            <button className="btn-secondary save-address-btn">Save Address</button>
          </div>
        </div>

        <div className="member-card">
          <div className="avatar">👦</div>
          <h3>{currentUser.fullName}</h3>
          <p>Member since {currentUser.joined}</p>
        </div>

        <div className="action-menu">
          <button className="menu-item" onClick={() => navigate('/orders')}>
            <div className="menu-icon"><ShoppingBag size={20} /></div>
            <span>Order History</span>
            <ChevronRight size={20} className="chevron" />
          </button>
          <button className="menu-item" onClick={() => navigate('/wishlist')}>
            <div className="menu-icon alert"><Heart size={20} /></div>
            <span>My Wishlist</span>
            <ChevronRight size={20} className="chevron" />
          </button>
          <button className="menu-item logout" onClick={logout}>
            <div className="menu-icon danger"><LogOut size={20} /></div>
            <span className="danger-text">Logout</span>
          </button>
        </div>

        <div className="support-section">
          <h4>SUPPORT</h4>
          <button className="support-item">
            <HelpCircle size={14} /> Help Center
          </button>
          <button className="support-item">
            <Mail size={14} /> Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
