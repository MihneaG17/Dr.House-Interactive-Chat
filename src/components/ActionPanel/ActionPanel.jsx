import React, { useState } from 'react';

function ActionPanel({ onInvestigationRequest, investigationsHistory, isThinking, onFinalConclusionsRequest, patientData }) {
  const availableInvestigations = patientData ? Object.keys(patientData.investigations || {}) : [];
  const [selectedValue, setSelectedValue] = useState('');

  const currentVal = selectedValue || (availableInvestigations.length > 0 ? availableInvestigations[0] : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentVal.trim() === '' || isThinking) return;
    onInvestigationRequest(currentVal);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <select 
          value={currentVal}
          onChange={(e) => setSelectedValue(e.target.value)}
          style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
          disabled={isThinking || availableInvestigations.length === 0}
        >
          {availableInvestigations.map(inv => (
            <option key={inv} value={inv}>
              {inv.charAt(0).toUpperCase() + inv.slice(1)}
            </option>
          ))}
        </select>
        <button 
          type="submit"
          style={{ padding: '0 1rem', backgroundColor: isThinking ? '#ccc' : '#e67e22', color: 'white', border: 'none', borderRadius: '4px', cursor: isThinking ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          disabled={isThinking || availableInvestigations.length === 0}
        >
          Cere Analiză
        </button>
      </form>

      <div style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
        <button 
          onClick={onFinalConclusionsRequest}
          style={{ width: '100%', padding: '0.8rem', backgroundColor: isThinking ? '#ccc' : '#8e44ad', color: 'white', border: 'none', borderRadius: '4px', cursor: isThinking ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          disabled={isThinking}
        >
          ⚖️ Cere Concluzii (Finalizare Joc)
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: 0, padding: '0.8rem', backgroundColor: '#ecf0f1', borderBottom: '1px solid #ddd', fontSize: '1.1rem', color: '#2c3e50', position: 'sticky', top: 0 }}>
          📁 Dosar Pacient
        </h3>
        <div style={{ padding: '0.8rem', flex: 1, overflowY: 'auto' }}>
          {(!investigationsHistory || investigationsHistory.length === 0) ? (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic', margin: 0 }}>Nu a fost cerută nicio analiză încă.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {investigationsHistory.map((item, index) => (
                <li key={index} style={{ backgroundColor: '#fff', padding: '0.8rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', borderLeft: '4px solid #3498db' }}>
                  <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.3rem' }}>Cerere: {item.request}</div>
                  <div style={{ color: '#555', fontSize: '0.95rem' }}>Rezultat: {item.result}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionPanel;
