const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password';

// --- Simple file-based "database" (JSON) ---
const dataPath = path.join(__dirname, 'contact_submissions.json');

function readSubmissions() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeSubmissions(list) {
  fs.writeFileSync(dataPath, JSON.stringify(list, null, 2), 'utf8');
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve built React frontend if present (Render)
const reactDist = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(reactDist)) {
  app.use(express.static(reactDist));
} else {
  // Serve legacy static files in repo root (local dev / InfinityFree flow)
  app.use(express.static(__dirname));
}

// Contact endpoint: stores submissions in JSON file
app.post('/api/contact', (req, res) => {
  const { name, email, company, role, timeline, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields.',
    });
  }

  const submissions = readSubmissions();

  const entry = {
    id: submissions.length + 1,
    name,
    email,
    company: company || '',
    role: role || '',
    timeline: timeline || '',
    message,
    received_at: new Date().toISOString(),
  };

  submissions.push(entry);

  try {
    writeSubmissions(submissions);
    console.log('New contact submission stored with id:', entry.id);
  } catch (err) {
    console.error('Failed to store contact submission:', err);
    return res.status(500).json({
      ok: false,
      error: 'Unable to store your message right now. Please try again later.',
    });
  }

  return res.json({
    ok: true,
    message: 'Thanks for reaching out – we’ll get back to you shortly.',
  });
});

// Quick diagnostics endpoint
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    storage: 'json-file',
    dataPath,
  });
});

// Temporary endpoint to view saved inquiries
app.get('/api/submissions', (req, res) => {
  const providedPassword =
    req.query.password ||
    req.headers['x-admin-password'] ||
    '';

  if (providedPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized. Provide a valid admin password.',
    });
  }

  try {
    const submissions = readSubmissions();
    return res.json({
      ok: true,
      count: submissions.length,
      submissions,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'Could not read submissions.',
    });
  }
});

// Fallback to index.html for any unknown GET route (optional)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (fs.existsSync(path.join(reactDist, 'index.html'))) {
    return res.sendFile(path.join(reactDist, 'index.html'));
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Veltrynox server listening on http://localhost:${PORT}`);
  console.log(`Contact submissions are stored in JSON at ${dataPath}`);
});

