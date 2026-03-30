import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container fade-in confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        <h2>Order Received!</h2>
        <p className="blessing-text">"Praise the Lord for His goodness."</p>
        
        <div className="order-details-box">
          <p>Thank you for your blessed order. Your items will be shipped soon.</p>
          <div className="order-id">
            <span>ORDER NUMBER</span>
            <strong>{orderId}</strong>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
