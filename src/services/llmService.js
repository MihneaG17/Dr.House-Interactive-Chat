// src/services/llmService.js

export const fetchAiResponse = async (agentRole, userPrompt) => {
  // Preluăm cheia secretă din fișierul .env
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.error("Lipsește cheia API din .env!");
    return "Eroare: Cheia API nu este configurată.";
  }

  // AICI ESTE SECRETUL PENTRU BAREM: 2 Modele diferite!
  // Setăm un model default (Llama 3 de la Meta) pentru primul agent
  let modelToUse = "llama3-8b-8192";

  // Dacă agentul are alt rol (ex: Boli Infecțioase), folosim alt model (Mixtral)
  // *Schimbă "Boli Infecțioase" cu specializarea pe care o ai tu în aplicație pentru Agentul 2
  if (agentRole === "Boli Infecțioase") {
    modelToUse = "mixtral-8x7b-32768";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: "system",
            content: `Ești un medic specialist cu rolul de: ${agentRole}. Analizează cazul și fii concis. Nu pune întrebări, doar trage concluzii medicale bazate pe date.`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.5 // Cât de creativ să fie (0.5 e un echilibru bun pentru medici)
      })
    });

    const data = await response.json();

    // Returnăm fix textul generat de AI
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Eroare la apelarea API-ului Groq:", error);
    return "Ne pare rău, asistentul nu a putut procesa informația. Verificați conexiunea.";
  }
};