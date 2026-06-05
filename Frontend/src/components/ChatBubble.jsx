import React from 'react';

const ChatBubble = ({ sender, message, timestamp = new Date() }) => {
  const isUser = sender === 'user';
  
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  const bubbleStyle = {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '16px',
    lineHeight: '1.5',
    fontSize: '0.92rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    wordBreak: 'break-word',
    backgroundColor: isUser ? 'var(--primary)' : 'var(--surface)',
    color: isUser ? '#ffffff' : 'var(--text)',
    border: isUser ? 'none' : '1px solid var(--border)',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    borderBottomRightRadius: isUser ? '4px' : '16px',
    borderBottomLeftRadius: isUser ? '16px' : '4px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: '8px 0',
    alignItems: isUser ? 'flex-end' : 'flex-start',
  };

  const timeStyle = {
    fontSize: '0.72rem',
    color: 'var(--muted)',
    marginTop: '4px',
    padding: '0 4px',
  };

  return (
    <div style={containerStyle}>
      <div style={bubbleStyle}>
        {message}
      </div>
      <span style={timeStyle}>{formattedTime}</span>
    </div>
  );
};

export default ChatBubble;
