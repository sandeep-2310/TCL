import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Send, X, Sparkles } from 'lucide-react';
import { botKnowledge, defaultResponse } from '../data/botKnowledge';
import './AIChatBot.css';

const AIChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Praise the Lord! I'm your TCL AI Assistant. How can I help you with our sacred collection today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const generateResponse = (text) => {
    const query = text.toLowerCase();
    let bestMatch = null;
    let maxOverlap = 0;

    for (const item of botKnowledge) {
      const overlap = item.keywords.filter(kw => query.includes(kw)).length;
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = item;
      }
    }

    if (bestMatch && maxOverlap > 0) {
      return bestMatch.response;
    }
    
    return defaultResponse;
  };

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
    const messageText = customText || input;
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now(), text: messageText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = generateResponse(messageText);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
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

        <div className="quick-replies">
          <p className="suggestion-title"><Sparkles size={12} /> Suggested Questions:</p>
          <div className="reply-chips">
            {['Track Order', 'Store Location', 'Spiritual Help', 'Contact Owner'].map((suggestion) => (
              <button 
                key={suggestion} 
                className="chip"
                onClick={() => handleSend(null, suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <form className="ai-chatbot-input" onSubmit={(e) => handleSend(e)}>
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
