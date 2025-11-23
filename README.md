Documentație Proiect – Manager de căutări integrat cu Bing Search
________________________________________
1. Introducere
Acest proiect reprezintă o aplicație web modernă care oferă utilizatorilor posibilitatea de a efectua căutări pe internet folosind serviciul Bing Web Search API, precum și gestionarea unui istoric personal de căutări salvat local în baza de date.
Aplicația este construită conform arhitecturii SPA + REST API, include autentificare, persistență a datelor, și oferă o interfață intuitivă pentru gestionarea căutărilor.
________________________________________
2. Obiectivul aplicației
Scopul aplicației este de a pune la dispoziția utilizatorului un manager personal de căutări online, în care acesta poate:
•	Să efectueze căutări pe internet folosind Bing Search API
•	Să vizualizeze rezultatele într-o interfață modernă
•	Să salveze și să gestioneze istoricul căutărilor sale
•	Să modifice sau să șteargă elementele din istoric
•	Să aibă acces doar la propriile date (prin autentificare de tip JWT)
________________________________________
3. Funcționalități principale
1.	Înregistrare cont și autentificare utilizator (JWT)
2.	Realizarea de căutări externe prin Bing Web Search API
3.	Vizualizarea rezultatelor căutării în interfață
4.	Salvarea în baza de date a căutărilor efectuate
5.	Listarea istoricului personal de căutări
6.	Editarea / ștergerea intrărilor din istoric
7.	Persistența sesiunii după refresh browser
8.	SPA Front-end în React cu Routing și componentizare
________________________________________
4. Tehnologii utilizate
Componentă	Tehnologie
Front-end	React.js + React Router
Back-end	Node.js + Express
Bază de date	MongoDB + Mongoose ORM
Autentificare	JWT (JSON Web Tokens)
API extern	Bing Web Search API (Azure Cognitive Services)
Control versiune	Git + GitHub
________________________________________
5. Arhitectura sistemului
Frontend (React SPA)
        ↓ REST API Calls (JSON)
Backend (Node + Express + JWT)
        ↓ ORM (Mongoose)
Database (MongoDB)
        ↓
External Service (Bing Search API)
________________________________________
6. Modelul bazei de date
User (Părinte)
Câmp	Tip
_id	ObjectId
username	string
email	string
passwordHash	string
SearchHistory (Copil)
Câmp	Tip
_id	ObjectId
userId	ObjectId (FK User)
query	string
createdAt	Date
updatedAt	Date
Relație: User 1 → N SearchHistory
________________________________________
7. Endpoint-uri API REST
Endpoint	Metodă	Descriere
/auth/register	POST	Înregistrare utilizator
/auth/login	POST	Autentificare + JWT
/search	GET	Efectuare căutare prin Bing API
/history	GET	Returnează istoricul utilizatorului
/history	POST	Adaugă o nouă căutare în DB
/history/:id	PUT	Modifică un element salvat
/history/:id	DELETE	Șterge un element din istoric
Toate răspunsurile vor fi în JSON cu coduri HTTP standard.
________________________________________
8. Flux de autentificare
Register/Login → JWT returnat către client → stocat în localStorage
→ Fiecare request protected trimite token → Backend validează token
→ Aprobă sau respinge accesul
________________________________________
9. Structura proiectului (GitHub Repository)
bing-search-manager/
   ├── backend/
   │     ├── src/
   │     └── package.json
   ├── frontend/
   │     ├── src/
   │     └── package.json
   └── README.md  (documentația proiectului)
________________________________________
10. Plan livrare
Etapă	Termen	Conținut
Etapa 1	25.11.2025	Documentație + repository + structură proiect
Etapa 2	20.12.2025	Backend REST funcțional + instrucțiuni rulare
Etapa 3	Final semestru	Frontend complet + integrare API extern
________________________________________
11. Concluzie
Proiectul „Manager de căutări cu Bing” este o aplicație completă ce înglobează principii moderne web:
API REST, autentificare, integrare servicii externe, persistența datelor și interfață SPA cu React.

