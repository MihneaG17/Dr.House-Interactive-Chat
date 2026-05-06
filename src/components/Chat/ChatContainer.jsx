import React from 'react';

function ChatContainer({ assistants }) {
  // Mock conversation for UI demonstration purposes
  const mockMessages = [
    {
      id: 1,
      sender: 'Doctor House',
      role: 'Jucător',
      text: 'Avem un pacient de 45 de ani cu febră, tuse și dureri toracice. Păreri?',
      type: 'user'
    },
    {
      id: 2,
      sender: `Agent 1 (${assistants[0]})`,
      role: assistants[0],
      text: 'Având în vedere tusea seacă, febra și durerea la inspir profund, ar putea fi o infecție respiratorie, poate chiar virală. Aș recomanda o radiografie toracică pentru a exclude o pneumonie.',
      type: 'agent1'
    },
    {
      id: 3,
      sender: `Agent 2 (${assistants[1]})`,
      role: assistants[1],
      text: 'Sunt de acord cu o posibilă pneumonie, dar să nu ignorăm durerea toracică la un pacient cu istoric de hipertensiune și tată cu infarct. Ar trebui să excludem și un sindrom coronarian acut. Un EKG ar fi prudent.',
      type: 'agent2'
    }
  ];

  const getMessageStyles = (type) => {
    switch (type) {
      case 'user':
        return { backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', alignSelf: 'flex-end', marginLeft: '20%' };
      case 'agent1':
        return { backgroundColor: '#f3e5f5', borderLeft: '4px solid #9c27b0', alignSelf: 'flex-start', marginRight: '20%' };
      case 'agent2':
        return { backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', alignSelf: 'flex-start', marginRight: '20%' };
      default:
        return { backgroundColor: '#f5f5f5', borderLeft: '4px solid #9e9e9e' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
        {mockMessages.map((msg) => (
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
      </div>
      
      <div className="chat-input-area" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <input 
          type="text" 
          placeholder="Spune ceva asistenților tăi..." 
          style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
          disabled
        />
        <button 
          style={{ padding: '0 1.5rem', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          disabled
        >
          Trimite
        </button>
      </div>
    </div>
  );
}

export default ChatContainer;
