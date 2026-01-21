# Bing Search Manager - SerpAPI Integration

Manager de căutări integrat cu SerpAPI (Google Search). A fost folosit acest API ca și alternativă deoarece Bing Search API a fost eliminat din lista serviciilor Microsoft la data de 11 august 2025.

### Repo: https://github.com/shotzwkey/bing-search-manager

### Clonare proiect
```bash
git clone https://github.com/shotzwkey/bing-search-manager.git
cd bing-search-manager
```

### Configurare backend
Se creeaza un fisier .env in directorul /backend cu urmatorul continut:
```bash
PORT=5000
MONGODB_URI=mongodb+srv://oranceanustefan23_db_user:UVrLQuszctl1OnX5@cluster0.ypzrb04.mongodb.net/searchManager?appName=Cluster0
JWT_SECRET=213f3565a6b511533df5c818fb144d1458c0c64048fc4bf069e32ce05f497adaa137ca2bef54bce7b7a6ea81b8fc4bd388b8a699491d301d0f68be40937ed1c8
SERPAPI_KEY=1f94d55e382006bf88beacfd30abb4b17f5288d3307e9063af8a7757e248e962
```

### Pornire backend
```bash
cd backend
npm install
npm start
```
### Pornire frontend in terminal separat
```bash
cd frontend
npm install
npm start
```

### Aplicatia ruleaza acum pe http://localhost:3000
