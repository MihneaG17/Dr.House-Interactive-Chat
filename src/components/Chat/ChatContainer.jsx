import React, { useState } from 'react';

function ChatContainer({ assistants, messages, isThinking, agentConfidence, onSendMessage }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && !isThinking) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const getMessageStyles = (type) => {
    switch (type) {
      case 'user':
        return { backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', alignSelf: 'flex-end', marginLeft: '20%' };
      case 'agent1':
        return { backgroundColor: '#f3e5f5', borderLeft: '4px solid #9c27b0', alignSelf: 'flex-start', marginRight: '20%' };
      case 'agent2':
        return { backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', alignSelf: 'flex-start', marginRight: '20%' };
      case 'system':
        return { backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800', alignSelf: 'center', width: '80%', fontStyle: 'italic', textAlign: 'center' };
      default:
        return { backgroundColor: '#f5f5f5', borderLeft: '4px solid #9e9e9e' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Agent Status Area (Confidence Bars) */}
      {agentConfidence && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee', flexShrink: 0 }}>
          {assistants.map((assistant, index) => (
            <div key={index} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Agent {index + 1} ({assistant})</span>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>{agentConfidence[index]}%</span>
              </div>
              {/* Confidence Bar */}
              <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${agentConfidence[index]}%`, 
                    height: '100%', 
                    backgroundColor: index === 0 ? '#9c27b0' : '#4caf50',
                    transition: 'width 0.5s ease-in-out'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
        {messages && messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              padding: '0.8rem 1rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              ...getMessageStyles(msg.type)
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <strong style={{ color: '#333' }}>{msg.sender}</strong>
            </div>
            <p style={{ margin: 0, lineHeight: '1.4', color: '#444' }}>{msg.text}</p>
          </div>
        ))}
        {isThinking && (
          <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', backgroundColor: '#f0f0f0', borderRadius: '8px', fontStyle: 'italic', color: '#666' }}>
            Asistenții se consultă... (Loading...)
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-area" style={{ marginTop: 'auto', flexShrink: 0, display: 'flex', gap: '0.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Spune ceva asistenților tăi..." 
          style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
          disabled={isThinking}
        />
        <button 
          type="submit"
          style={{ padding: '0 1.5rem', backgroundColor: isThinking ? '#ccc' : '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: isThinking ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          disabled={isThinking}
        >
          Trimite
        </button>
      </form>
    </div>
  );
}

export default ChatContainer;
