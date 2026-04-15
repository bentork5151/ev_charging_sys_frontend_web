const http = require('http');

const port = 8080;

const stations = [
  { id: 1, name: "Downtown charging center", locationId: "LOC001", status: "ACTIVE", createdAt: new Date().toISOString(), directionLink: "https://maps.google.com" },
  { id: 2, name: "Highway Side Hub", locationId: "LOC002", status: "MAINTENANCE", createdAt: new Date().toISOString(), directionLink: "https://maps.google.com" },
  { id: 3, name: "City Mall Plaza", locationId: "LOC003", status: "ACTIVE", createdAt: new Date().toISOString(), directionLink: "https://maps.google.com" },
];

const chargers = [
  { id: 1, ocppId: "CP001", stationId: "LOC001", connectorType: "Type 2", chargerType: "AC", rate: 12, isOccupied: false, availability: true },
  { id: 2, ocppId: "CP002", stationId: "LOC001", connectorType: "CCS2", chargerType: "DC", rate: 25, isOccupied: true, availability: true },
  { id: 3, ocppId: "CP003", stationId: "LOC002", connectorType: "Type 2", chargerType: "AC", rate: 12, isOccupied: false, availability: false },
];

const sessions = [
  { id: "SES123", charger: { ocppId: "CP001" }, status: "ACTIVE", energyKwh: 15.5, cost: 186 },
  { id: "SES124", charger: { ocppId: "CP002" }, status: "COMPLETED", energyKwh: 22.1, cost: 552.5 },
];

const server = http.createServer((req, res) => {
  // Set CORS headers manually if needed, though Vite proxy handles it
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;
  
  // Log request for debugging
  console.log(`${req.method} ${url}`);

  res.setHeader('Content-Type', 'application/json');

  // Auth Routes
  if (url === '/api/admin/login' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ token: 'mock-jwt-token', message: 'Login successful' }));
    return;
  }

  if (url === '/api/admin/signup' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Signup successful' }));
    return;
  }

  // Dashboard Stats
  if (url === '/api/users/total') { 
    res.writeHead(200);
    res.end((1250 + Math.floor(Math.random() * 50)).toString()); 
    return; 
  }
  if (url === '/api/revenue/total') { 
    res.writeHead(200);
    res.end((45800 + Math.floor(Math.random() * 1000)).toString()); 
    return; 
  }
  if (url === '/api/sessions/total') { 
    res.writeHead(200);
    res.end((342 + Math.floor(Math.random() * 10)).toString()); 
    return; 
  }
  if (url === '/api/sessions/energy') { 
    res.writeHead(200);
    res.end((8904 + Math.floor(Math.random() * 200)).toString()); 
    return; 
  }

  // Station Stats
  if (url === '/api/stations/total') { 
    res.writeHead(200);
    res.end(stations.length.toString()); 
    return; 
  }
  if (url === '/api/stations/active') { 
    res.writeHead(200);
    res.end(stations.filter(s => s.status === 'ACTIVE').length.toString()); 
    return; 
  }
  if (url === '/api/stations/uptime') { 
    res.writeHead(200);
    res.end("98.5"); 
    return; 
  }
  if (url === '/api/stations/error/today') { 
    res.writeHead(200);
    res.end("2"); 
    return; 
  }
  if (url === '/api/stations/all') { 
    res.writeHead(200);
    res.end(JSON.stringify(stations)); 
    return; 
  }

  // Charger Stats
  if (url === '/api/chargers/total') { 
    res.writeHead(200);
    res.end(chargers.length.toString()); 
    return; 
  }
  if (url === '/api/chargers/available') { 
    res.writeHead(200);
    res.end(chargers.filter(c => c.availability && !c.isOccupied).length.toString()); 
    return; 
  }
  if (url === '/api/chargers/ac') { 
    res.writeHead(200);
    res.end(chargers.filter(c => c.chargerType === 'AC').length.toString()); 
    return; 
  }
  if (url === '/api/chargers/dc') { 
    res.writeHead(200);
    res.end(chargers.filter(c => c.chargerType === 'DC').length.toString()); 
    return; 
  }
  if (url === '/api/chargers/all') { 
    res.writeHead(200);
    res.end(JSON.stringify(chargers)); 
    return; 
  }

  // Session Records
  if (url === '/api/sessions/all/records') { 
    res.writeHead(200);
    res.end(JSON.stringify(sessions)); 
    return; 
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Not Found' }));
});

server.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
