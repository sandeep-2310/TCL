import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Calendar, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../firebase';
import './Orders.css';

const Orders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      if (currentUser) {
        const userOrders = await fetchUserOrders(currentUser.uid);
        setOrders(userOrders);
      }
      setLoading(false);
    };
    getOrders();
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="page-container fade-in">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Retrieving your sacred history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-container fade-in">
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ChevronLeft size={24} />
        </button>
        <h2>Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon-wrap">
            <ShoppingBag size={64} />
          </div>
          <h3>No orders yet</h3>
          <p>Your spiritual journey is just beginning. Explore our collection to find inspiration.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div className="order-main-info">
                  <div className="order-id-block">
                    <span className="label">ORDER #</span>
                    <span className="value">{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="order-date-block">
                    <Calendar size={14} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="order-status-pill">
                  {order.status || 'Processing'}
                </div>
              </div>

              <div className="order-items-summary">
                {order.items.map((item, index) => (
                  <div className="item-mini" key={index}>
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-mini-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} • ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <span className="label">TOTAL AMOUNT</span>
                  <span className="value">₹{order.total}</span>
                </div>
                <button className="order-detail-btn" onClick={() => navigate(`/order-confirmation/${order.id}`)}>
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
