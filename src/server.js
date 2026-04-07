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
import savePromptHandler from '../api/save-prompt.js';
import getPromptsHandler from '../api/get-prompts.js';
import deletePromptHandler from '../api/delete-prompt.js';
import updateStatsHandler from '../api/update-stats.js';
import getProfileHandler from '../api/get-profile.js';
import getSecurityQuestionHandler from '../api/get-security-question.js';
import resetPasswordHandler from '../api/reset-password.js';

// Helper function to create mock Vercel-style request/response
function createMockHandlers(req, res) {
  const mockReq = {
    method: req.method,
    body: req.body,
    query: req.query
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
  
  return { mockReq, mockRes };
}

// API Routes
app.post('/api/register', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await registerHandler(mockReq, mockRes);
});

app.post('/api/login', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await loginHandler(mockReq, mockRes);
});

app.post('/api/save-prompt', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await savePromptHandler(mockReq, mockRes);
});

app.get('/api/get-prompts', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await getPromptsHandler(mockReq, mockRes);
});

app.delete('/api/delete-prompt', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await deletePromptHandler(mockReq, mockRes);
});

app.post('/api/update-stats', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await updateStatsHandler(mockReq, mockRes);
});

app.get('/api/get-profile', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await getProfileHandler(mockReq, mockRes);
});

app.post('/api/get-security-question', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await getSecurityQuestionHandler(mockReq, mockRes);
});

app.post('/api/reset-password', async (req, res) => {
  const { mockReq, mockRes } = createMockHandlers(req, res);
  await resetPasswordHandler(mockReq, mockRes);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server kjører på http://localhost:${PORT}`);
  console.log(`📝 Åpne http://localhost:${PORT}/registration.html for å teste\n`);
});
