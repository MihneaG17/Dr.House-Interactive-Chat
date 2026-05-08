export const checkWinCondition = (userInput, actualDiagnosis) => {
  const normalizedInput = userInput.trim().toLowerCase();
  const normalizedActual = actualDiagnosis.trim().toLowerCase();
  
  if (normalizedInput === normalizedActual) return true;
  
  const keywords = normalizedActual.split(/\s+/).filter(w => w.length > 4);
  let matchCount = 0;
  
  for (const keyword of keywords) {
    const cleanKeyword = keyword.replace(/[^a-zțșăîâ]/g, '');
    if (cleanKeyword && normalizedInput.includes(cleanKeyword)) {
      matchCount++;
    }
  }
  
  return matchCount >= 1;
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
