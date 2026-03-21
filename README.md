# 🩺 AI House: Multi-Agent Medical Diagnostic Simulator

Acest proiect este o aplicație interactivă care simulează un proces de diagnosticare medicală bazat pe arhitectura de tip *Multi-Agent AI Debate*. Doi sau trei agenți AI (modele locale de limbaj) acționează ca asistenți medicali cu opinii divergente, în timp ce utilizatorul preia rolul doctorului principal, având puterea de a cere investigații suplimentare și de a lua decizia finală.

---

## 📋 Product Backlog & User Stories

Pentru a respecta standardele Agile, backlog-ul proiectului este împărțit în **User Stories** (funcționalități din perspectiva jucătorului) și **Technical Tasks** (sarcini de sistem și infrastructură).

### 🏥 Epic 1: Inițializarea Cazului și Interfața

**US-01: Încărcarea datelor pacientului**
> **Ca** jucător (Dr. House), **vreau** să primesc o fișă de prezentare la începutul rundei care să conțină simptomele vizibile și istoricul medical al pacientului, **pentru a** avea contextul de bază înainte de a cere părerea asistenților mei.
* **Criterii de acceptare:** - [ ] Sistemul încarcă datele dintr-un fișier local JSON. 
  - [ ] Interfața afișează secțiunile "Istoric Medical" și "Simptome Inițiale". 
  - [ ] Diagnosticul real rămâne strict ascuns.

**US-02: Alegerea specializării asistenților**
> **Ca** jucător, **vreau** să pot selecta specializarea asistenților mei (ex: Boli Infecțioase, Cardiologie, Neurologie) la începutul cazului, **pentru a** influența tipul de argumente pe care aceștia le vor aduce în dezbatere.
* **Criterii de acceptare:** - [ ] Interfața oferă un meniu de selecție a rolurilor înainte de începerea chat-ului.
  - [ ] Rolurile sunt vizibile ca etichete lângă numele agenților.

**US-03: Urmărirea dezbaterii**
> **Ca** jucător, **vreau** să urmăresc un schimb inițial de replici între asistenții mei într-o interfață de tip chat, **pentru a** vedea cum interpretează ei datele inițiale și ce ipoteze formulează.
* **Criterii de acceptare:** - [ ] Interfața delimitează vizual cine vorbește (culori/iconițe diferite pentru agenți). 
  - [ ] Chat-ul se oprește automat după faza de brainstorming pentru a-mi permite să intervin.

---

### 🔬 Epic 2: Interactivitate și Investigații (Core Gameplay)

**US-04: Solicitarea analizelor medicale**
> **Ca** jucător, **vreau** să pot întrerupe dezbaterea și să introduc comenzi pentru investigații suplimentare (ex. "Fă-i un RMN"), **pentru a** testa ipotezele asistenților și a găsi indicii noi.
* **Criterii de acceptare:** - [ ] Există un câmp de text sau o listă de butoane pentru a cere o analiză. 
  - [ ] Jocul așteaptă rezultatul înainte ca agenții să răspundă din nou.

**US-05: Panoul de istoric al investigațiilor**
> **Ca** jucător, **vreau** să pot deschide un panou lateral cu toate analizele pe care le-am cerut până în acel moment și rezultatele lor, **pentru a** nu pierde șirul indiciilor pe măsură ce dezbaterea avansează.
* **Criterii de acceptare:** - [ ] Un buton „Dosar Pacient” deschide lista actualizată a analizelor efectuate în runda curentă.

**US-06: Feedback pentru analize irelevante**
> **Ca** jucător, **vreau** să primesc un mesaj clar din partea sistemului dacă cer o analiză care nu este disponibilă sau care este irelevantă, **pentru a** ști că trebuie să mă orientez spre alte investigații.
* **Criterii de acceptare:** - [ ] Trimiterea unei comenzi neașteptate afișează un rezultat standardizat (ex: "Echipamentul nu este disponibil" sau "Rezultate în parametri normali").

---

### 🧠 Epic 3: Starea Asistenților

**US-07: Vizualizarea nivelului de certitudine**
> **Ca** jucător, **vreau** să văd un indicator vizual (ex: o bară de progres sau procente) care arată nivelul de încredere/moral al fiecărui asistent în diagnosticul său, **pentru a** ști pe cine să mă bazez când iau decizia finală.
* **Criterii de acceptare:** - [ ] Interfața afișează un scor de încredere sub avatarul fiecărui agent.
  - [ ] Scorul se actualizează vizual în funcție de rezultatele analizelor pe care le cer.

---

### ⚖️ Epic 4: Rezoluția Cazului

**US-08: Pledoaria finală**
> **Ca** jucător, **vreau** să le cer asistenților să își prezinte diagnosticul final într-un format clar, cu argumente pro și contra, **pentru a** avea un rezumat structurat înainte de a alege un tratament.
* **Criterii de acceptare:** - [ ] Există un buton de "Concluzii".
  - [ ] La apăsare, agenții afișează o listă structurată cu diagnosticul propus și justificarea.

**US-09: Decizia finală și Rezultatul**
> **Ca** jucător, **vreau** să aleg diagnosticul unuia dintre asistenți sau să introduc propriul meu diagnostic, **pentru a** vedea dacă am salvat pacientul.
* **Criterii de acceptare:** - [ ] Jocul afișează diagnosticul real la final.
  - [ ] Apare un mesaj clar de Victorie (pacient salvat) sau Înfrângere (diagnostic greșit).

---

### 📊 Epic 5: Statistici și Progresie

**US-10: Istoricul cazurilor și rata de succes**
> **Ca** jucător, **vreau** să am acces la un ecran de statistici unde să văd cazurile rezolvate anterior și rata mea de succes, **pentru a**-mi urmări evoluția ca diagnostician.
* **Criterii de acceptare:** - [ ] Meniul principal conține o secțiune "Statistici". 
  - [ ] Datele sunt salvate și preluate dintr-o soluție de stocare persistentă asociată sesiunii mele (ex: `localStorage` în browser sau o bază de date atașată profilului), asigurând păstrarea progresului între sesiuni.
  - [ ] Ecranul afișează numărul total de cazuri jucate, numărul de diagnostice corecte (victorii) și procentajul de succes.
---

## 🛠️ Technical Tasks (Dezvoltare și Infrastructură)
*Pentru a asigura funcționarea corectă a poveștilor de mai sus, următoarele sarcini de sistem sunt incluse în Backlog:*
- **TSK-01:** Implementarea și injectarea prompturilor de sistem dinamice în modelele LLM locale pentru a diferenția agenții.
- **TSK-02:** Scrierea unui script de Python pentru **LLM Evals** (testare automată a ratei de succes a agenților prin parsarea cazurilor JSON fără UI).
- **TSK-03:** Configurarea **Pipeline-ului CI/CD** (GitHub Actions) pentru verificarea codului la fiecare Pull Request.
- **TSK-04:** Crearea diagramei UML de arhitectură și secvență pentru fluxul comunicațional.
