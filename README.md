# Dr.House-Interactive-Chat
# 🩺 AI House: Multi-Agent Medical Diagnostic Simulator

Acest proiect este o aplicație interactivă care simulează un proces de diagnosticare medicală bazat pe arhitectura de tip *Multi-Agent AI Debate*. Doi/trei agenți AI (modele locale de limbaj) acționează ca asistenți medicali cu opinii divergente, în timp ce utilizatorul preia rolul doctorului principal, având puterea de a cere investigații suplimentare și de a lua decizia finală.

---

## 📋 Product Backlog & User Stories

Mai jos sunt detaliate cele 10 User Stories care au stat la baza dezvoltării acestui proiect, structurate în format Agile (Rol - Acțiune - Scop), alături de criteriile lor de acceptare.

### 🏥 Epic 1: Inițializarea Cazului și Interfața

**US-01: Încărcarea datelor pacientului**
> **Ca** jucător (Dr. House), **vreau** să primesc o fișă de prezentare la începutul rundei care să conțină simptomele vizibile și istoricul medical al pacientului, **pentru a** avea contextul de bază înainte de a cere părerea asistenților mei.
* **Criterii de acceptare:** - [ ] Sistemul încarcă datele dintr-un fișier local JSON. 
  - [ ] Interfața afișează secțiunile "Istoric Medical" și "Simptome Inițiale". 
  - [ ] Diagnosticul real rămâne strict ascuns în backend.

**US-02: Personalitățile asistenților virtuali**
> **Ca** sistem, **vreau** să injectez prompturi de sistem divergente celor doi agenți AI, **pentru a** asigura o dezbatere contradictorie și argumente complet diferite.
* **Criterii de acceptare:** - [ ] Cele două modele LLM locale primesc instrucțiuni diferite la inițializare (ex. Agentul 1 axat pe simptome acute, Agentul 2 pe istoric, etc). 
  - [ ] Răspunsurile reflectă constant aceste unghiuri medicale.

**US-03: Urmărirea dezbaterii**
> **Ca** jucător, **vreau** să urmăresc un schimb inițial de replici între asistenții mei într-o interfață de tip chat, **pentru a** vedea cum interpretează ei datele inițiale și ce ipoteze formulează.
* **Criterii de acceptare:** - [ ] Interfața delimitează vizual cine vorbește (Agent 1 sau Agent 2 sau Agent 3). 
  - [ ] Chat-ul se blochează după faza de brainstorming, așteptând intervenția jucătorului.

---

### 🔬 Epic 2: Interactivitate și Investigații (Core Gameplay)

**US-04: Solicitarea analizelor medicale**
> **Ca** jucător, **vreau** să pot întrerupe dezbaterea și să introduc comenzi pentru investigații suplimentare (ex. "Fă-i un RMN"), **pentru a** testa ipotezele asistenților.
* **Criterii de acceptare:** - [ ] Interfața conține o zonă de input pentru investigații. 
  - [ ] Jocul este pus pe pauză până când sistemul procesează cererea.

**US-05: Returnarea rezultatelor dinamice**
> **Ca** sistem, **vreau** să caut investigația cerută de jucător în baza de date a cazului și să returnez rezultatul, **pentru a** valida sau invalida teoriile medicale curente.
* **Criterii de acceptare:** - [ ] Algoritmul face match între cererea jucătorului și cheile din JSON. 
  - [ ] Se returnează textul aferent sau un mesaj default dacă analiza este irelevantă.

**US-06: Reacția asistenților la noile dovezi**
> **Ca** sistem, **vreau** să injectez rezultatul noii analize în promptul agenților, **pentru a** forța o reacție în timp real și a crea un proces adaptativ.
* **Criterii de acceptare:** - [ ] Agenții primesc un prompt dinamic cu rezultatul analizei. 
  - [ ] Generarea următoarei replici reflectă apărarea diagnosticului inițial sau propunerea unuia nou.

---

### 🧠 Epic 3: Sistemul Dinamic de Moral

**US-07: Modificarea încrederii asistenților**
> **Ca** sistem, **vreau** să calculez un scor de moral/încredere pentru fiecare asistent pe baza corectitudinii ipotezelor lor, **pentru a** le influența tonul și certitudinea în răspunsuri.
* **Criterii de acceptare:** - [ ] Variabila `incredere_agent` este ajustată în backend. 
  - [ ] Promptul instruiește LLM-ul să folosească un ton arogant (scor mare) sau ezitant (scor mic).

---

### ⚖️ Epic 4: Rezoluția Cazului

**US-08: Pledoaria finală**
> **Ca** jucător, **vreau** să le cer asistenților să își prezinte diagnosticul final într-un format clar, **pentru a** avea un rezumat structurat înainte de a lua decizia.
* **Criterii de acceptare:** - [ ] Agenții generează un răspuns strict structurat: Diagnostic Propus, Argumente Pro, Contraargument.

**US-09: Decizia finală și Rezultatul**
> **Ca** jucător, **vreau** să aleg diagnosticul unuia dintre asistenți sau să introduc propriul diagnostic, **pentru a** vedea dacă am salvat pacientul.
* **Criterii de acceptare:** - [ ] Ecranul final compară decizia jucătorului cu variabila `diagnostic_real` din JSON. 
  - [ ] Afișează un mesaj de victorie/înfrângere.

---

### ⚙️ Epic 5: Inginerie, CI/CD și Evals (QA)

**US-10: Evaluarea automată a modelelor (LLM Evals)**
> **Ca** dezvoltator, **vreau** să rulez un script de teste automate care trece agenții prin toate cazurile din baza de date, **pentru a** verifica rata de succes a diagnosticelor.
* **Criterii de acceptare:** - [ ] Scriptul simulează flow-ul jocului fără interfață grafică. 
  - [ ] Extrage diagnosticul final propus de agenți și generează un raport procentual de succes.
