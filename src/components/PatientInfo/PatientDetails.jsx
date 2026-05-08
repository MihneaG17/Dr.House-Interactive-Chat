import React from 'react';

function PatientDetails({ patient }) {
  if (!patient) return <p>Se încarcă datele pacientului...</p>;

  return (
    <div className="patient-details" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="patient-header" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>
        <h3 style={{ margin: 0 }}>{patient.patientName}, {patient.age} ani ({patient.gender})</h3>
        <p style={{ margin: '0.2rem 0 0', color: '#666', fontSize: '0.9rem' }}>Ocupație: {patient.occupation}</p>
      </div>

      <div className="patient-section">
        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🩺 Simptome Inițiale</h4>
        <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#333' }}>
          {patient.initialSymptoms.map((symptom, index) => (
            <li key={`sym-${index}`} style={{ marginBottom: '0.3rem' }}>{symptom}</li>
          ))}
        </ul>
      </div>

      <div className="patient-section">
        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>📋 Istoric Medical</h4>
        <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#333' }}>
          {patient.medicalHistory.map((historyItem, index) => (
            <li key={`hist-${index}`} style={{ marginBottom: '0.3rem' }}>{historyItem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PatientDetails;
