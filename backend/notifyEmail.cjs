const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const EMAILS_FILE = path.join(__dirname, 'scheduledEmails.json');

function readEmails() {
  try {
    return JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeEmails(data) {
  fs.writeFileSync(EMAILS_FILE, JSON.stringify(data, null, 2));
}

// POST /notifyEmail
router.post('/notifyEmail', (req, res) => {
  const { email, content, platform, time, reminderMinutes = 0 } = req.body;
  if (!email || !time) return res.status(400).json({ error: 'Email and time required' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (isNaN(Date.parse(time))) return res.status(400).json({ error: 'Invalid time format' });

  const emails = readEmails();
  // Confirmation email (send now)
  emails.push({
    email,
    content,
    platform,
    time: new Date().toISOString().slice(0, 16),
    sent: false,
    type: 'confirmation',
    originalTime: time
  });
  // Reminder email (send at reminder time)
  let reminderTime = time;
  if (reminderMinutes > 0) {
    const d = new Date(time);
    d.setMinutes(d.getMinutes() - reminderMinutes);
    reminderTime = d.toISOString().slice(0, 16);
  }
  emails.push({
    email,
    content,
    platform,
    time: reminderTime,
    sent: false,
    type: 'reminder',
    originalTime: time
  });
  writeEmails(emails);
  res.json({ success: true, message: 'Email notification scheduled' });
});

// GET /scheduledEmails
router.get('/scheduledEmails', (req, res) => {
  const emails = readEmails();
  res.json(emails);
});

module.exports = router; 