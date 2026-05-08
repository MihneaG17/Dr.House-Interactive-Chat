// src/services/llmService.js

export const fetchAiResponse = async (agentRole, userPrompt, agentIndex) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.error("Lipsește cheia API din .env!");
    return "Eroare: Cheia API nu este configurată.";
  }

  // Să ne asigurăm că aplicația citește corect cheia (afișăm doar primele 6 litere pentru securitate)
  console.log("INFO: Facem apel cu cheia care începe cu:", apiKey.substring(0, 6));

  const modelToUse = agentIndex === 0 ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`, // .trim() taie spatiile invizibile adaugate din greseala
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: "system",
            content: `Ești un medic specialist cu rolul de: ${agentRole}. Analizează cazul și fii extrem de concis (maxim 3-4 propoziții scurte). Folosește un limbaj accesibil, ușor de înțeles de către o persoană fără pregătire medicală, evitând jargonul complex. Nu pune întrebări, doar trage concluzii clare și simple bazate pe date.`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("🚨 GROQ A RESPINS CEREREA. Motiv:", errorData);
      return `Groq API Error: ${errorData.error?.message || "Eroare necunoscută"}`;
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("🚨 EROARE FATALĂ DE REȚEA:", error);
    return `Eroare conexiune: ${error.message}`;
  }
};

export const generateMedicalCases = async () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.error("Lipsește cheia API din .env!");
    return [];
  }

  const systemPrompt = `Ești un expert medical și un creator de scenarii clinice.
Generează 3 cazuri medicale unice și realiste în limba română, în format JSON.
Fiecare caz trebuie să respecte STRICT structura următoare:
- "id": string unic (ex: "case-1")
- "patientName": string (nume și prenume românesc)
- "age": număr
- "gender": string
- "occupation": string
- "initialSymptoms": array de stringuri (minim 3 simptome)
- "medicalHistory": array de stringuri
- "investigations": obiect (chei = analize comune ex: "sânge", "ekg", "radiografie", "ct", "pcr"; valori = rezultatele medicale care susțin sau infirmă diagnosticul)
- "realDiagnosis": string (diagnosticul corect, precis)

Trebuie să returnezi DIRECT ȘI EXCLUSIV un array JSON, fără formatare Markdown (\`\`\`json), fără explicații suplimentare. Array-ul să aibă exact 3 obiecte.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generează array-ul cu cele 3 cazuri acum." }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`API a răspuns cu eroarea: ${response.status}`);
    }

    const data = await response.json();
    let rawContent = data.choices[0].message.content.trim();

    if (rawContent.startsWith("\`\`\`json")) {
      rawContent = rawContent.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (rawContent.startsWith("\`\`\`")) {
      rawContent = rawContent.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    const cases = JSON.parse(rawContent);
    return Array.isArray(cases) ? cases : [];

  } catch (error) {
    console.error("Eroare la generarea cazurilor dinamice:", error);
    return [];
  }
};