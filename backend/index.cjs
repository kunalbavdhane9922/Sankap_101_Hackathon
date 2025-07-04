const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const bcrypt = require('bcryptjs');

// Import database connection
require('./db.js');

app.use(cors());
app.use(express.json());

// MongoDB models
const User = require('./models/User');
const Account = require('./models/Account');
const Analytics = require('./models/Analytics');

// API endpoints
app.get('/income', require('./income.cjs'));
app.get('/billing', require('./billing.cjs'));
app.get('/settings', require('./settings.cjs'));
app.get('/analytics', require('./analytics.cjs'));
app.get('/trendingTopics', require('./trendingTopics.cjs'));
app.post('/seoEngine', require('./seoEngine.cjs'));
app.get('/instagram', require('./instagram.cjs'));
app.get('/facebook', require('./facebook.cjs'));
app.get('/youtube', require('./youtube.cjs'));
app.get('/twitter', require('./twitter.cjs'));

// Register competitor comparison route
const compareCompetitors = require('./compareCompetitors.cjs');
app.use(compareCompetitors);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check if default user exists
app.get('/test-user', async (req, res) => {
  try {
    const user = await User.findOne({ username: 'demo' });
    if (user) {
      res.json({ 
        exists: true, 
        username: user.username, 
        hasPassword: !!user.password,
        password: user.password // This will show the actual password for debugging
      });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MongoDB-powered endpoints ---

// Add a new account for a user (default user if not provided)
app.post('/api/accounts', async (req, res) => {
  try {
    console.log('POST /api/accounts body:', req.body);
    let { userId, platform, name, followers, avatar, platformIcon, status } = req.body;
    if (!userId) {
      // Use default user
      const user = await User.findOne({ username: 'demo' });
      if (!user) throw new Error('Default user not found');
      userId = user._id;
    }
    if (!platform || !name) {
      throw new Error('Missing required fields: platform and name');
    }
    // --- FIX: Convert followers to number if string ---
    if (typeof followers === 'string') {
      followers = Number(followers.replace(/,/g, ''));
    }
    const account = await Account.create({ user: userId, platform, name, followers, avatar, platformIcon, status });
    // Optionally create analytics for this account
    await Analytics.create({ account: account._id, followers, avgViews: 0, engagement: 0, history: [] });
    res.json(account);
  } catch (err) {
    console.error('Failed to add account:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all accounts for a user (default user if not provided)
app.get('/api/accounts', async (req, res) => {
  try {
    let { userId } = req.query;
    if (!userId) {
      const user = await User.findOne({ username: 'demo' });
      userId = user._id;
    }
    const accounts = await Account.find({ user: userId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics for all accounts of a user (default user if not provided)
app.get('/api/analytics', async (req, res) => {
  try {
    let { userId } = req.query;
    if (!userId) {
      const user = await User.findOne({ username: 'demo' });
      userId = user._id;
    }
    const accounts = await Account.find({ user: userId });
    const analytics = await Analytics.find({ account: { $in: accounts.map(a => a._id) } });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove an account by id
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const accountId = req.params.id;
    await Account.findByIdAndDelete(accountId);
    await Analytics.deleteMany({ account: accountId });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete account:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Endpoints ---
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return res.status(400).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ username, email, password: hash, preferences: { niche: '', notifications: true, theme: 'light' } });
    res.json({ email });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', { username: req.body.username, password: req.body.password ? '***' : 'missing' });
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'All fields required' });
    // Allow login by username or email
    let user = await User.findOne({ $or: [{ username }, { email: username }] });
    console.log('User found:', user ? { username: user.username, hasPassword: !!user.password } : 'not found');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    console.log('Login successful for:', user.username);
    res.json({ email: user.email || '' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

const notifyEmail = require('./notifyEmail.cjs');
app.use(notifyEmail);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  console.log('Note: MongoDB connection may fail if IP is not whitelisted in Atlas');
  console.log('Static endpoints (income, billing, etc.) will still work');
}); 