export const checkWinCondition = (selectedDiagnosis, actualDiagnosis) => {
  return selectedDiagnosis.trim().toLowerCase() === actualDiagnosis.trim().toLowerCase();
};

export const handleInvestigationRequest = (request, caseData) => {
  if (!caseData || !caseData.investigations) {
    return "Echipamentul nu este disponibil sau pacientul nu poate fi testat.";
  }

  const normalizedRequest = request.trim().toLowerCase();
  
  for (const key in caseData.investigations) {
    if (normalizedRequest.includes(key) || key.includes(normalizedRequest)) {
      return caseData.investigations[key];
    }
  }

  return "Analiză indisponibilă sau irelevantă pentru acest caz. Rezultate în parametri normali.";
};
