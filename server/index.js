const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Mock Data
let workers = [
  { id: 'W-2041', name: 'John Doe', heartRate: 72, fatigue: 24, risk: 12, compliance: true, status: 'safe' },
  { id: 'W-2139', name: 'Aria Stark', heartRate: 110, fatigue: 68, risk: 74, compliance: false, status: 'critical' },
  { id: 'W-1952', name: 'Robert Baratheon', heartRate: 95, fatigue: 45, risk: 42, compliance: true, status: 'warning' },
];

let alerts = [
  { id: 'A-562', type: 'PPE Violation', user: 'Jamie Lannister', time: new Date().toLocaleTimeString(), status: 'active', priority: 'high' }
];

// AI Logic Simulation
const calculateRisk = (hRate, fatigue, compliance) => {
  let score = 0;
  if (hRate > 100) score += 40;
  if (fatigue > 60) score += 30;
  if (!compliance) score += 30;
  return Math.min(100, score);
};

// API Endpoints
app.get('/api/workers', (req, res) => res.json(workers));
app.get('/api/alerts', (req, res) => res.json(alerts));

app.post('/api/alerts', (req, res) => {
  const newAlert = { id: `A-${Date.now()}`, ...req.body, time: new Date().toLocaleTimeString(), status: 'active' };
  alerts.unshift(newAlert);
  io.emit('new_alert', newAlert);
  res.status(201).json(newAlert);
});

// Socket.io Real-time Simulation
io.on('connection', (socket) => {
  console.log('Client connected to AI Uplink');
  
  const simulationInterval = setInterval(() => {
    workers = workers.map(w => {
      const hRate = Math.max(60, Math.min(130, w.heartRate + Math.floor(Math.random() * 5) - 2));
      const fatigue = Math.max(0, Math.min(100, w.fatigue + (Math.random() > 0.9 ? 1 : 0)));
      const risk = calculateRisk(hRate, fatigue, w.compliance);
      
      let status = 'safe';
      if (risk > 70) status = 'critical';
      else if (risk > 40) status = 'warning';
      
      return { ...w, heartRate: hRate, fatigue, risk, status };
    });
    
    socket.emit('workers_update', workers);
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(simulationInterval);
    console.log('Client disconnected from AI Uplink');
  });
});

server.listen(PORT, () => console.log(`🚀 Neural Server running on port ${PORT}`));
