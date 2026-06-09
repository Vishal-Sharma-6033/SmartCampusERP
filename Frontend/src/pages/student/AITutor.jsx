import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ChatBubble from '../../components/ChatBubble';
import TypingIndicator from '../../components/TypingIndicator';
import Toast from '../../components/Toast';

const AITutor = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      message: "Hi! I'm your Smart Campus AI. Ask me about exams, assignments, or your performance!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    setInputText('');

    // Append user message
    const userMsg = {
      sender: 'user',
      message: userMessageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', { message: userMessageText });
      
      // The backend returns the ApiResponse wrapper with data = response text
      const aiResponseText = response.data.data || "I'm sorry, I couldn't understand that request. Could you rephrase it?";
      
      const aiMsg = {
        sender: 'ai',
        message: aiResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setError('Connection to AI Tutor lost. Please try again.');
      
      const errMsg = {
        sender: 'ai',
        message: 'Sorry, I encountered an error. Could you please resend your message?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container" style={{
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      height: 'calc(100vh - 110px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>AI Tutor Assistant</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>● Online & Active</span>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/student/performance')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          AI Performance Analytics
        </button>
      </div>

      {/* Chat Window */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Messages Pane */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((msg, index) => (
            <ChatBubble
              key={index}
              sender={msg.sender}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSendMessage}
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            gap: '12px'
          }}
        >
          <input
            type="text"
            className="form-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. 'How is my performance?' or 'When are my exams?')"
            disabled={isTyping}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: 'var(--radius)',
              padding: '0 16px',
              fontSize: '0.92rem'
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isTyping || !inputText.trim()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AITutor;
