import React, { useState, useEffect } from 'react';
import PatientDetails from './components/PatientInfo/PatientDetails';
import ChatContainer from './components/Chat/ChatContainer';
import ActionPanel from './components/ActionPanel/ActionPanel';
import mockCaseData from './data/mockCase.json';
import { handleInvestigationRequest } from './services/gameLogic';
import { sendMessageToAgent } from './services/llmService';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [assistants, setAssistants] = useState(['Cardiolog', 'Boli Infecțioase']);
  const [patientData, setPatientData] = useState(null);
  const [investigationsHistory, setInvestigationsHistory] = useState([]);
  
  // Epic 3: Starea Asistenților și Chat AI
  const [agentConfidence, setAgentConfidence] = useState([50, 50]);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Simulăm încărcarea datelor pacientului
    setPatientData(mockCaseData);
  }, []);

  const handleStartGame = async () => {
    setGameStarted(true);
    
    const initialMsg = {
      id: Date.now(),
      sender: 'Doctor House',
      role: 'Jucător',
      text: 'Avem un pacient cu febră, tuse și dureri toracice. Păreri?',
      type: 'user'
    };
    setMessages([initialMsg]);
    setIsThinking(true);

    let currentMessages = [initialMsg];
    for (let i = 0; i < assistants.length; i++) {
      const response = await sendMessageToAgent(assistants[i], currentMessages, initialMsg.text);
      const agentMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: response,
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, agentMsg];
      setMessages(currentMessages);
    }
    setIsThinking(false);
  };

  const handleAssistantChange = (index, value) => {
    const newAssistants = [...assistants];
    newAssistants[index] = value;
    setAssistants(newAssistants);
  };

  const handleRequest = async (requestText) => {
    const result = handleInvestigationRequest(requestText, patientData);
    setInvestigationsHistory(prev => [...prev, { request: requestText, result }]);
    
    const isRelevant = result !== "Analiză indisponibilă sau irelevantă pentru acest caz. Rezultate în parametri normali.";
    
    setAgentConfidence(prev => prev.map(conf => {
      if (isRelevant) {
        const change = Math.floor(Math.random() * 30) - 10;
        return Math.min(100, Math.max(0, conf + change));
      } else {
        return Math.max(0, conf - 5);
      }
    }));

    const newMsg = {
      id: Date.now(),
      sender: 'Sistem',
      role: 'Sistem',
      text: `Rezultat analiză (${requestText}): ${result}`,
      type: 'system'
    };
    
    let currentMessages = [...messages, newMsg];
    setMessages(currentMessages);
    setIsThinking(true);

    for (let i = 0; i < assistants.length; i++) {
      const response = await sendMessageToAgent(assistants[i], currentMessages, newMsg.text);
      const agentMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: response,
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, agentMsg];
      setMessages(currentMessages);
    }
    setIsThinking(false);
  };

  if (!gameStarted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>AI House Simulator</h1>
          
          <h3 style={{ marginBottom: '1rem', color: '#34495e' }}>Alege echipa de asistenți:</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Specializare Asistent 1:</label>
            <select 
              value={assistants[0]} 
              onChange={(e) => handleAssistantChange(0, e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Cardiolog">Cardiolog</option>
              <option value="Boli Infecțioase">Boli Infecțioase</option>
              <option value="Neurolog">Neurolog</option>
              <option value="Pneumolog">Pneumolog</option>
              <option value="Medicină Internă">Medicină Internă</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Specializare Asistent 2:</label>
            <select 
              value={assistants[1]} 
              onChange={(e) => handleAssistantChange(1, e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Cardiolog">Cardiolog</option>
              <option value="Boli Infecțioase">Boli Infecțioase</option>
              <option value="Neurolog">Neurolog</option>
              <option value="Pneumolog">Pneumolog</option>
              <option value="Medicină Internă">Medicină Internă</option>
            </select>
          </div>

          <button 
            onClick={handleStartGame}
            style={{ width: '100%', padding: '1rem', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Începe Cazul
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      <header>
        <h1>AI House: Diagnostic Simulator</h1>
      </header>
      
      <main style={{ display: 'flex', flex: 1, gap: '1rem', marginTop: '1rem', overflow: 'hidden' }}>
        <section className="patient-panel" style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff', overflowY: 'auto' }}>
          <h2>Fișa Pacientului</h2>
          <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
          <PatientDetails patient={patientData} />
        </section>

        <section className="chat-panel" style={{ flex: 2, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
          <h2>Consiliu Medical</h2>
          <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
          <ChatContainer 
            assistants={assistants} 
            messages={messages} 
            isThinking={isThinking} 
            agentConfidence={agentConfidence} 
          />
        </section>

        <section className="action-panel" style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
          <h2>Acțiuni & Investigații</h2>
          <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
          <ActionPanel 
            onInvestigationRequest={handleRequest} 
            investigationsHistory={investigationsHistory} 
          />
        </section>
      </main>
    </div>
  );
}

export default App;
