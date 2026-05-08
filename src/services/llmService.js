import { agentPrompts } from '../data/prompts';

export const sendMessageToAgent = async (agentRole, contextMessages, newInput) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulăm răspunsul LLM-ului în funcție de rol
      const isInvestigation = newInput.toLowerCase().includes('rezultat analiză');
      let responseText = '';

      if (isInvestigation) {
        if (agentRole === 'Cardiolog') {
          responseText = 'Aceste analize îmi ridică unele semne de întrebare. EKG-ul și markerii cardiaci sunt cruciali pentru excluderea unui infarct. Rămân precaut, dar tabloul se complică.';
        } else if (agentRole === 'Boli Infecțioase') {
          responseText = 'Aha! Rezultatele susțin ipoteza unui proces infecțios! Cred că suntem pe drumul cel bun. Probabil e nevoie de un tratament antibiotic țintit sau antiviral.';
        } else if (agentRole === 'Neurolog') {
          responseText = 'Din punct de vedere neurologic, nu văd modificări critice momentan. Voi continua să analizez situația detașat.';
        } else if (agentRole === 'Pneumolog') {
          responseText = 'Radiografia și simptomele arată clar o afectare respiratorie. Infiltratele interstițiale indică de obicei o pneumonie atipică. E exact domeniul meu.';
        } else {
          responseText = 'Să integrăm aceste date noi în tabloul clinic general. E un caz interesant.';
        }
      } else {
        responseText = `În calitate de ${agentRole}, cred că istoricul și simptomele arată o direcție destul de clară. Mă bazez pe experiența mea clinică, dar aș vrea mai multe investigații specifice.`;
      }

      resolve(responseText);
    }, 2000); // Întârziere de 2 secunde pentru a simula "gândirea" AI
  });
};
