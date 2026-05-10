import React, { useState, useEffect } from 'react';
import PatientDetails from './components/PatientInfo/PatientDetails';
import ChatContainer from './components/Chat/ChatContainer';
import ActionPanel from './components/ActionPanel/ActionPanel';
import { handleInvestigationRequest, checkWinCondition } from './services/gameLogic';
import { fetchAiResponse, generateMedicalCases } from './services/llmService';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [assistants, setAssistants] = useState(['Cardiolog', 'Boli Infecțioase']);
  const [patientData, setPatientData] = useState(null);
  const [investigationsHistory, setInvestigationsHistory] = useState([]);

  // Epic 3: Starea Asistenților și Chat AI
  const [agentConfidence, setAgentConfidence] = useState([50, 50]);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  // Epic 4: Pledoaria Finală și Rezultatul
  const [isGameEnding, setIsGameEnding] = useState(false);
  const [hasFinalConclusions, setHasFinalConclusions] = useState(false);
  const [playerDiagnosis, setPlayerDiagnosis] = useState('');
  const [gameResult, setGameResult] = useState(null); // null, 'win', 'lose'

  const [activePatient, setActivePatient] = useState(null);
  const [availableCases, setAvailableCases] = useState([]);
  const [isGeneratingCases, setIsGeneratingCases] = useState(false);

  // Epic 5 (US-10): Statistici și Persistență
  const [gameStats, setGameStats] = useState([]);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const savedStats = localStorage.getItem('ai_house_stats');
    if (savedStats) {
      try {
        setGameStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Eroare la parsarea statisticilor:", e);
      }
    }
  }, []);

  const loadNewCases = async () => {
    setIsGeneratingCases(true);
    setAvailableCases([]);
    setActivePatient(null);
    const newCases = await generateMedicalCases();
    setAvailableCases(newCases);
    setIsGeneratingCases(false);
  };

  useEffect(() => {
    if (availableCases.length === 0) {
      loadNewCases();
    }
  }, []);

  const resetGameToLobby = () => {
    setGameStarted(false);
    setActivePatient(null);
    setMessages([]);
    setInvestigationsHistory([]);
    setAgentConfidence([50, 50]);
    setIsGameEnding(false);
    setHasFinalConclusions(false);
    setPlayerDiagnosis('');
    setGameResult(null);
  };

  const resetAndGenerateNew = () => {
    resetGameToLobby();
    loadNewCases();
  };

  const handleStartGame = async () => {
    if (!activePatient) return;
    setPatientData(activePatient);
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
    try {
      if (i > 0) {
        await new Promise(res => setTimeout(res, 2500));
      }
      const response = await fetchAiResponse(assistants[i], initialMsg.text, i);
      const agentMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: response || "Eroare: Nu s-a primit răspuns.",
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, agentMsg];
      setMessages(currentMessages);
    } catch (error) {
      console.error("Eroare in App.jsx la apelarea LLM:", error);
      const errorMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: "Nu am putut analiza cazul din cauza unei erori interne.",
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, errorMsg];
      setMessages(currentMessages);
    }
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
    try {
      if (i > 0) {
        await new Promise(res => setTimeout(res, 2500));
      }
      const response = await fetchAiResponse(assistants[i], newMsg.text, i);
      const agentMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: response || "Eroare: Nu s-a primit răspuns.",
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, agentMsg];
      setMessages(currentMessages);
    } catch (error) {
      console.error("Eroare in App.jsx la apelarea LLM:", error);
      const errorMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: "A apărut o eroare la interpretarea analizei.",
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, errorMsg];
      setMessages(currentMessages);
    }
  }
  setIsThinking(false);
};

const handleUserMessage = async (userText) => {
  if (!userText.trim() || isThinking) return;

  const userMsg = {
    id: Date.now(),
    sender: 'Doctor House',
    role: 'Jucător',
    text: userText,
    type: 'user'
  };

  let currentMessages = [...messages, userMsg];
  setMessages(currentMessages);
  setIsThinking(true);

  try {
    // 1. Apelăm Agentul 1
    const responseAgent1 = await fetchAiResponse(assistants[0], userText, 0);
    const msgAgent1 = {
      id: Date.now() + 1,
      sender: `Agent 1 (${assistants[0]})`,
      role: assistants[0],
      text: responseAgent1 || "Eroare: Nu s-a primit răspuns.",
      type: 'agent1'
    };
    currentMessages = [...currentMessages, msgAgent1];
    setMessages(currentMessages);

    // Delay artificial
    await new Promise(res => setTimeout(res, 2500));

    // 2. Apelăm Agentul 2 cu context
    const promptAgent2 = `Utilizatorul a spus: "${userText}". Colegul tău (${assistants[0]}) a răspuns: "${responseAgent1}". Care este părerea ta medicală? Contrazice sau completează.`;
    const responseAgent2 = await fetchAiResponse(assistants[1], promptAgent2, 1);
    const msgAgent2 = {
      id: Date.now() + 2,
      sender: `Agent 2 (${assistants[1]})`,
      role: assistants[1],
      text: responseAgent2 || "Eroare: Nu s-a primit răspuns.",
      type: 'agent2'
    };
    currentMessages = [...currentMessages, msgAgent2];
    setMessages(currentMessages);

  } catch (error) {
    console.error("Eroare in timpul dezbaterii:", error);
    const errorMsg = {
      id: Date.now() + 3,
      sender: 'Sistem',
      role: 'Sistem',
      text: "Eroare de conexiune la serverul AI în timpul dezbaterii.",
      type: 'system'
    };
    currentMessages = [...currentMessages, errorMsg];
    setMessages(currentMessages);
  } finally {
    setIsThinking(false);
  }
};

const handleFinalConclusionsRequest = async () => {
  if (isThinking) return;
  setIsThinking(true);

  const sysPrompt = "Prezintă diagnosticul tău final structurat astfel:\n1. Diagnostic propus\n2. Argumente Pro\n3. Argumente Contra";

  const userMsg = {
    id: Date.now(),
    sender: 'Sistem',
    role: 'Sistem',
    text: "Doctorul a cerut concluziile finale. Vă rog să vă prezentați diagnosticul final structurat.",
    type: 'system'
  };

  let currentMessages = [...messages, userMsg];
  setMessages(currentMessages);

  for (let i = 0; i < assistants.length; i++) {
    try {
      if (i > 0) {
        await new Promise(res => setTimeout(res, 2500));
      }
      const response = await fetchAiResponse(assistants[i], sysPrompt, i);
      const agentMsg = {
        id: Date.now() + Math.random(),
        sender: `Agent ${i + 1} (${assistants[i]})`,
        role: assistants[i],
        text: response || "Eroare: Nu s-a primit răspuns.",
        type: `agent${i + 1}`
      };
      currentMessages = [...currentMessages, agentMsg];
      setMessages(currentMessages);
    } catch (error) {
      console.error("Eroare la concluzii finale:", error);
    }
  }

  setIsThinking(false);

  // Afișăm butonul pentru decizia finală
  setTimeout(() => {
    setHasFinalConclusions(true);
  }, 1500);
};

const saveGameResult = (isWin, finalDiag) => {
  const newStat = {
    patientName: patientData.patientName,
    diagnosis: finalDiag,
    result: isWin ? 'win' : 'lose',
    date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
  };
  const updatedStats = [newStat, ...gameStats];
  setGameStats(updatedStats);
  localStorage.setItem('ai_house_stats', JSON.stringify(updatedStats));
  setGameResult(isWin ? 'win' : 'lose');
};

const handleAgentChoice = (agentMsg) => {
  if (!agentMsg) return;
  const diagAlias = `Diagnosticul ${agentMsg.role}`;
  setPlayerDiagnosis(diagAlias);
  const isWin = checkWinCondition(agentMsg.text, patientData.realDiagnosis);
  saveGameResult(isWin, diagAlias);
};

const handleCustomChoice = () => {
  if (!playerDiagnosis.trim()) return;
  const isWin = checkWinCondition(playerDiagnosis, patientData.realDiagnosis);
  saveGameResult(isWin, playerDiagnosis);
};

if (showStats) {
  const totalGames = gameStats.length;
  const wins = gameStats.filter(s => s.result === 'win').length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '2rem' }}>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '800px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2c3e50' }}>📊 Statistici Globale</h1>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: '#34495e', fontSize: '2.5rem' }}>{totalGames}</h2>
            <p style={{ margin: 0, color: '#7f8c8d', fontWeight: 'bold' }}>Cazuri Jucate</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: '#27ae60', fontSize: '2.5rem' }}>{wins}</h2>
            <p style={{ margin: 0, color: '#7f8c8d', fontWeight: 'bold' }}>Victorii</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: '#2980b9', fontSize: '2.5rem' }}>{winRate}%</h2>
            <p style={{ margin: 0, color: '#7f8c8d', fontWeight: 'bold' }}>Rata de Succes</p>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem', color: '#34495e' }}>Istoric Ultimile Cazuri</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
          {gameStats.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic', padding: '2rem 0' }}>Nu există date înregistrate. Joacă primul caz!</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {gameStats.map((stat, index) => (
                <li key={index} style={{ padding: '1.2rem', marginBottom: '0.8rem', borderLeft: `6px solid ${stat.result === 'win' ? '#2ecc71' : '#e74c3c'}`, backgroundColor: '#f8f9fa', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Pacient: {stat.patientName}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>{stat.date}</span>
                  </div>
                  <div style={{ color: '#555' }}>
                    <span style={{ fontWeight: 'bold' }}>Verdictul tău:</span> {stat.diagnosis}
                    <span style={{ display: 'inline-block', marginLeft: '1rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: stat.result === 'win' ? '#e8f8f5' : '#fdedec', color: stat.result === 'win' ? '#27ae60' : '#c0392b' }}>
                      {stat.result === 'win' ? 'VICTORIE' : 'ÎNFRÂNGERE'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => setShowStats(false)}
          style={{ width: '100%', marginTop: '2rem', padding: '1rem', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Înapoi la Selecție Pacienți
        </button>
      </div>
    </div>
  );
}

if (!gameStarted) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#2c3e50' }}>AI House Simulator</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setShowStats(true)}
          style={{ padding: '0.6rem 1.5rem', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        >
          📊 Vezi Statistici ({gameStats.length} meciuri)
        </button>
      </div>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#7f8c8d' }}>Alege un pacient și formează-ți echipa de diagnosticare.</p>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>
        {isGeneratingCases ? (
          <div style={{ textAlign: 'center', padding: '3rem', width: '100%' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⏳</div>
            <h2 style={{ color: '#2980b9' }}>Se generează cazuri noi...</h2>
            <p style={{ color: '#7f8c8d' }}>Medicii AI pregătesc scenarii clinice unice.</p>
          </div>
        ) : availableCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
            <p style={{ color: '#e74c3c' }}>A apărut o eroare la generare. Încearcă din nou.</p>
            <button onClick={loadNewCases} style={{ padding: '0.8rem 2rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Regenerează</button>
          </div>
        ) : (
          availableCases.map(patient => (
            <div
              key={patient.id}
              onClick={() => setActivePatient(patient)}
              style={{
                flex: '1 1 300px',
                backgroundColor: activePatient?.id === patient.id ? '#e3f2fd' : '#fff',
                border: activePatient?.id === patient.id ? '2px solid #3498db' : '1px solid #ddd',
                padding: '1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: activePatient?.id === patient.id ? '0 8px 16px rgba(52, 152, 219, 0.2)' : '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{patient.patientName}, {patient.age} ani</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>{patient.occupation}</p>
              <div><strong>Simptom principal:</strong><br /> <span style={{ color: '#e74c3c' }}>{patient.initialSymptoms[0]}</span></div>
            </div>
          ))
        )}
      </div>

      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#34495e', textAlign: 'center' }}>Echipa de Asistenți</h3>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Agent 1:</label>
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

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Agent 2:</label>
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
        </div>

        <button
          onClick={handleStartGame}
          disabled={!activePatient}
          style={{ width: '100%', padding: '1rem', backgroundColor: activePatient ? '#2ecc71' : '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: activePatient ? 'pointer' : 'not-allowed' }}
        >
          {activePatient ? 'Deschide Cazul' : 'Selectează un pacient'}
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
          onSendMessage={handleUserMessage}
        />
        {hasFinalConclusions && !isGameEnding && !gameResult && (
          <div style={{ marginTop: '1rem', flexShrink: 0 }}>
            <button
              onClick={() => setIsGameEnding(true)}
              style={{ width: '100%', padding: '1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
              ⚖️ Sunt gata să dau verdictul
            </button>
          </div>
        )}
      </section>

      <section className="action-panel" style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
        <h2>Acțiuni & Investigații</h2>
        <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
        <ActionPanel
          onInvestigationRequest={handleRequest}
          investigationsHistory={investigationsHistory}
          isThinking={isThinking}
          onFinalConclusionsRequest={handleFinalConclusionsRequest}
          patientData={patientData}
        />
      </section>
    </main>

    {/* MODAL PENTRU DECIZIA FINALĂ */}
    {isGameEnding && !gameResult && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <h2 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Decizia Finală</h2>
          <p style={{ marginBottom: '2rem', color: '#7f8c8d' }}>Alege diagnosticul final pentru pacient bazat pe concluziile asistenților sau introdu o variantă proprie.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => {
                const agent1FinalMsg = messages.filter(m => m.type === 'agent1').pop();
                handleAgentChoice(agent1FinalMsg);
              }}
              style={{ padding: '1rem', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'background-color 0.2s' }}
            >
              Adoptă diagnosticul Agentului 1 ({assistants[0]})
            </button>

            <button
              onClick={() => {
                const agent2FinalMsg = messages.filter(m => m.type === 'agent2').pop();
                handleAgentChoice(agent2FinalMsg);
              }}
              style={{ padding: '1rem', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'background-color 0.2s' }}
            >
              Adoptă diagnosticul Agentului 2 ({assistants[1]})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <hr style={{ flex: 1, borderColor: '#eee' }} />
            <span style={{ padding: '0 1rem', color: '#95a5a6', fontWeight: 'bold' }}>SAU</span>
            <hr style={{ flex: 1, borderColor: '#eee' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              value={playerDiagnosis}
              onChange={(e) => setPlayerDiagnosis(e.target.value)}
              placeholder="Introdu un diagnostic personalizat..."
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #ccc', fontSize: '1.1rem' }}
            />
            <button
              onClick={handleCustomChoice}
              style={{ padding: '1rem', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              Trimite verdictul meu
            </button>
          </div>
        </div>
      </div>
    )}

    {/* MODAL PENTRU REZULTAT */}
    {gameResult && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: gameResult === 'win' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(231, 76, 60, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <h1 style={{ color: gameResult === 'win' ? '#27ae60' : '#c0392b', fontSize: '2rem', marginBottom: '1rem' }}>
            {gameResult === 'win' ? '🏆 Victorie! Pacient Salvat!' : '💀 Înfrângere! Diagnostic Greșit'}
          </h1>
          <h3 style={{ margin: '1rem 0', color: '#34495e' }}>Diagnosticul tău: <span style={{ fontWeight: 'normal' }}>{playerDiagnosis}</span></h3>
          <h3 style={{ margin: '1rem 0', color: '#2980b9' }}>Diagnosticul Real: <span style={{ fontWeight: 'normal' }}>{patientData.realDiagnosis}</span></h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={resetGameToLobby}
              style={{ padding: '0.8rem 1.5rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              Înapoi la Selecție
            </button>
            <button
              onClick={resetAndGenerateNew}
              style={{ padding: '0.8rem 1.5rem', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              Generează cazuri noi și joacă iar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default App;
