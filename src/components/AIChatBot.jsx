import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';
import './AIChatBot.css';

const AIChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Praise the Lord! I'm your TCL AI Assistant. How can I help you with our sacred collection today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (text) => {
    const query = text.toLowerCase();
    if (query.includes('hello') || query.includes('hi')) return "Praise the Lord! How can I assist you in your spiritual search today?";
    if (query.includes('shipping') || query.includes('delivery')) return "We deliver sacred items across India. Standard shipping takes 3-5 business days. Express options are available at checkout.";
    if (query.includes('order')) return "You can view and track all your blessed orders in the 'Order History' section of your profile.";
    if (query.includes('payment')) return "We accept UPI (GPay, PhonePe), Credit/Debit cards, and Net Banking securely via Razorpay.";
    if (query.includes('location') || query.includes('store') || query.includes('address')) return "Our main store is located at 12-45, Market Street, Kakinada, Andhra Pradesh. We are open Mon-Sat, 9AM-7PM.";
    if (query.includes('contact') || query.includes('owner') || query.includes('number')) return "You can contact our owner, Sandeep, at +91 99887 76655 or email us at support@tcl.com.";
    if (query.includes('return') || query.includes('refund')) return "We accept returns for damaged items within 7 days of delivery. Please keep all original sacred packaging.";
    
    return "I'm still learning how to better serve the TCL community. For specific inquiries, you can reach our support team directly at +91 99887 76655. God bless!";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chatbot-overlay fade-in">
      <div className="ai-chatbot-container slide-up">
        <div className="ai-chatbot-header">
          <div className="header-info">
            <div className="bot-avatar"><Bot size={20} /></div>
            <div>
              <h3>TCL AI Helper</h3>
              <p className="status-online">Online</p>
            </div>
          </div>
          <button className="close-bot-btn" onClick={onClose} aria-label="Close Assistant"><X size={20} /></button>
        </div>

        <div className="ai-chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble-row ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-bubble-row bot">
              <div className="message-avatar"><Bot size={16} /></div>
              <div className="message-bubble typing">
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="ai-chatbot-input" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask me about orders, shipping..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()} className="send-msg-btn">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBot;
