import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Truck, RotateCcw, CreditCard, ShieldCheck } from 'lucide-react';
import './HelpCenter.css';

const HelpCenter = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      icon: <Truck size={24} />,
      title: "Shipping Information",
      content: "We deliver sacred literature and items across India. Express shipping usually takes 3-5 business days. Remote areas may take up to 7 days."
    },
    {
      icon: <RotateCcw size={24} />,
      title: "Return & Refunds",
      content: "Items can be returned within 7 days of delivery if they are damaged or incorrect. Please ensure the items are in their original sacred condition."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Payment Methods",
      content: "We support UPI (PhonePe, GPay), Credit/Debit cards, and Net Banking through our secure Razorpay integration."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Shopping",
      content: "All transactions are encrypted and your personal data is protected under our strict privacy guidelines."
    }
  ];

  return (
    <div className="help-center-page page-container fade-in">
      <div className="help-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h2>Help Center</h2>
      </div>

      <div className="help-hero">
        <div className="hero-icon">📖</div>
        <h1>How can we assist you?</h1>
        <p>Find answers to the most common questions about our service and sacred collection.</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-card" key={index}>
            <div className="faq-icon-wrap">
              {faq.icon}
            </div>
            <div className="faq-body">
              <h3>{faq.title}</h3>
              <p>{faq.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="support-cta">
        <h3>Still have questions?</h3>
        <p>Our team is here to help you with your spiritual journey.</p>
        <button className="btn-primary" onClick={() => navigate('/contact')}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
