import React from 'react';
// import PatientDetails from './components/PatientInfo/PatientDetails';
// import ChatContainer from './components/Chat/ChatContainer';
// import ActionPanel from './components/ActionPanel/ActionPanel';

function App() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      <header>
        <h1>AI House: Diagnostic Simulator</h1>
      </header>
      
      <main style={{ display: 'flex', flex: 1, gap: '1rem', marginTop: '1rem' }}>
        <section className="patient-panel" style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2>Fișa Pacientului</h2>
          {/* <PatientDetails /> */}
        </section>

        <section className="chat-panel" style={{ flex: 2, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2>Consiliu Medical</h2>
          {/* <ChatContainer /> */}
        </section>

        <section className="action-panel" style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2>Acțiuni & Investigații</h2>
          {/* <ActionPanel /> */}
        </section>
      </main>
    </div>
  );
}

export default App;
