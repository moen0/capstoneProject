import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES modules workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS) from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Import API routes from parent directory
import registerHandler from '../api/register.js';
import loginHandler from '../api/login.js';

// API Routes
app.post('/api/register', async (req, res) => {
  // Create a mock Request/Response that matches Vercel's format
  const mockReq = {
    method: 'POST',
    body: req.body
  };
  
  const mockRes = {
    status: (code) => {
      res.status(code);
      return mockRes;
    },
    json: (data) => res.json(data),
    setHeader: (key, value) => res.setHeader(key, value),
    end: () => res.end()
  };
  
  await registerHandler(mockReq, mockRes);
});

app.post('/api/login', async (req, res) => {
  const mockReq = {
    method: 'POST',
    body: req.body
  };
  
  const mockRes = {
    status: (code) => {
      res.status(code);
      return mockRes;
    },
    json: (data) => res.json(data),
    setHeader: (key, value) => res.setHeader(key, value),
    end: () => res.end()
  };
  
  await loginHandler(mockReq, mockRes);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server kjører på http://localhost:${PORT}`);
  console.log(`📝 Åpne http://localhost:${PORT}/registration.html for å teste\n`);
});
