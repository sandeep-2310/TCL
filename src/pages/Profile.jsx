import { useState, useEffect } from 'react';
import { User, MapPin, Heart, ShoppingBag, LogOut, HelpCircle, Mail, ChevronRight, LogIn, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { updateUserData } from '../firebase';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    phone: ''
  });
  const [address, setAddress] = useState({
    house: '',
    street: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous) {
      setPersonalInfo({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || ''
      });
      const addr = currentUser.addresses?.[0] || {};
      setAddress({
        house: addr.house || '',
        street: addr.street || '',
        city: addr.city || '',
        pincode: addr.pincode || ''
      });
    }
  }, [currentUser]);

  if (loading || !currentUser) return <div className="page-container fade-in">Loading...</div>;

  const handlePersonalSave = async () => {
    try {
      await updateUserData(currentUser.uid, {
        fullName: personalInfo.fullName,
        phone: personalInfo.phone
      });
      setIsEditingPersonal(false);
      alert("Personal information updated successfully!");
    } catch (error) {
      alert("Failed to update personal info.");
    }
  };

  const handleAddressSave = async () => {
    try {
      const newAddress = { ...address };
      await updateUserData(currentUser.uid, {
        addresses: [newAddress]
      });
      setIsEditingAddress(false);
      alert("Address updated successfully!");
    } catch (error) {
      alert("Failed to update address.");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pincode' && value !== '' && (!/^\d+$/.test(value) || value.length > 6)) return;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    if (value !== '' && (!/^\d+$/.test(value) || value.length > 10)) return;
    setPersonalInfo(prev => ({ ...prev, phone: value }));
  };

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
          <h1>{personalInfo.fullName.split(' ')[0] || 'Member'}</h1>
          <p className="blessing">"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you."</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section personal-card">
          <div className="section-header">
            <h3>Personal Details</h3>
            <button className="edit-icon-btn" onClick={() => setIsEditingPersonal(!isEditingPersonal)}>
              {isEditingPersonal ? <X size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
          
          <div className="detail-item">
            <span className="label">FULL NAME</span>
            {isEditingPersonal ? (
              <input 
                className="edit-input"
                type="text" 
                value={personalInfo.fullName} 
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
              />
            ) : (
              <p>{personalInfo.fullName || 'Not specified'}</p>
            )}
          </div>
          <div className="detail-item">
            <span className="label">EMAIL ADDRESS</span>
            <p>{currentUser.email}</p>
          </div>
          <div className="detail-item borderless">
            <span className="label">PHONE NUMBER</span>
            {isEditingPersonal ? (
              <input 
                className="edit-input"
                type="tel" 
                maxLength="10"
                placeholder="10-digit mobile"
                value={personalInfo.phone} 
                onChange={handlePhoneChange}
              />
            ) : (
              <p>{personalInfo.phone || 'Not specified'}</p>
            )}
          </div>
          
          {isEditingPersonal && (
            <button className="btn-primary edit-profile-btn" onClick={handlePersonalSave}>
              <Check size={18} /> Save Changes
            </button>
          )}
        </div>

        <div className="profile-section address-card">
          <div className="section-header">
            <h3>Saved Address (India)</h3>
            <button className="edit-icon-btn" onClick={() => setIsEditingAddress(!isEditingAddress)}>
              {isEditingAddress ? <X size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
          
          <div className="address-form">
            <div className="form-group">
              <label>HOUSE / FLAT NO.</label>
              <input 
                type="text" 
                name="house"
                value={address.house} 
                onChange={handleAddressChange}
                readOnly={!isEditingAddress} 
              />
            </div>
            <div className="form-group">
              <label>STREET / AREA</label>
              <input 
                type="text" 
                name="street"
                value={address.street} 
                onChange={handleAddressChange}
                readOnly={!isEditingAddress} 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CITY</label>
                <input 
                  type="text" 
                  name="city"
                  value={address.city} 
                  onChange={handleAddressChange}
                  readOnly={!isEditingAddress} 
                />
              </div>
              <div className="form-group">
                <label>PINCODE</label>
                <input 
                  type="text" 
                  name="pincode"
                  maxLength="6"
                  value={address.pincode} 
                  onChange={handleAddressChange}
                  readOnly={!isEditingAddress} 
                />
              </div>
            </div>
            {isEditingAddress && (
              <button className="btn-secondary save-address-btn" onClick={handleAddressSave}>
                <Check size={18} /> Update Address
              </button>
            )}
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
