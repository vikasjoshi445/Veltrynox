const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database setup (SQLite file in project root) ---
const dbPath = path.join(__dirname, 'veltrynox.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    role TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    received_at TEXT NOT NULL
  );
`);

const insertSubmission = db.prepare(`
  INSERT INTO contact_submissions
    (name, email, company, role, timeline, message, received_at)
  VALUES
    (@name, @email, @company, @role, @timeline, @message, @received_at)
`);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend (index.html, styles, scripts, etc.)
app.use(express.static(__dirname));

// Contact endpoint: stores submissions in SQLite
app.post('/api/contact', (req, res) => {
  const { name, email, company, role, timeline, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields.',
    });
  }

  const entry = {
    name,
    email,
    company: company || '',
    role: role || '',
    timeline: timeline || '',
    message,
    received_at: new Date().toISOString(),
  };

  try {
    const result = insertSubmission.run(entry);
    console.log('New contact submission stored with id:', result.lastInsertRowid);
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

// Fallback to index.html for any unknown GET route (optional)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Veltrynox server listening on http://localhost:${PORT}`);
  console.log(`Contact submissions are stored in SQLite at ${dbPath}`);
});

