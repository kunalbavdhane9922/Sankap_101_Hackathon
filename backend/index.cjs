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
const Feedback = require('./models/Feedback');

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
        email: user.email,
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

// Test login endpoint for debugging
app.post('/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Test login attempt:', { username, password: password ? '***' : 'missing' });
    
    let user = await User.findOne({ $or: [{ username }, { email: username }] });
    console.log('User found:', user ? { username: user.username, email: user.email } : 'not found');
    
    if (!user) {
      return res.json({ success: false, error: 'User not found' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    
    if (!match) {
      return res.json({ success: false, error: 'Password mismatch' });
    }
    
    res.json({ success: true, email: user.email });
  } catch (err) {
    console.error('Test login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fix demo user endpoint
app.post('/fix-demo-user', async (req, res) => {
  try {
    // Delete existing demo user
    await User.deleteOne({ username: 'demo' });
    
    // Create new demo user with email
    const username = 'demo';
    const email = 'demo@example.com';
    const password = 'demo123';
    const hash = await bcrypt.hash(password, 10);
    
    const user = new User({ username, email, password: hash });
    await user.save();
    
    res.json({ success: true, message: 'Demo user recreated with email' });
  } catch (err) {
    console.error('Fix demo user error:', err);
    res.status(500).json({ success: false, error: err.message });
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

// Store feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (!text || !rating) {
      return res.status(400).json({ error: 'Text and rating are required' });
    }
    const feedback = await Feedback.create({ text, rating });
    res.json({ success: true, feedback });
  } catch (err) {
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
    res.json({ 
      email: user.email || '', 
      username: user.username,
      fullName: user.fullName || user.username,
      profilePhoto: user.profilePhoto || ''
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Profile management endpoints
app.get('/api/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      username: user.username,
      email: user.email,
      fullName: user.fullName || user.username,
      mobileNumber: user.mobileNumber || '',
      profilePhoto: user.profilePhoto || '',
      bio: user.bio || '',
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const { email, fullName, mobileNumber, bio } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.fullName = fullName || user.fullName;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.bio = bio || user.bio;
    
    await user.save();
    
    res.json({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      profilePhoto: user.profilePhoto,
      bio: user.bio
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/api/profile/photo', async (req, res) => {
  try {
    const { email, profilePhoto } = req.body;
    if (!email || !profilePhoto) return res.status(400).json({ error: 'Email and profile photo required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.profilePhoto = profilePhoto;
    await user.save();
    
    res.json({ profilePhoto: user.profilePhoto });
  } catch (err) {
    console.error('Update profile photo error:', err);
    res.status(500).json({ error: 'Failed to update profile photo' });
  }
});

const notifyEmail = require('./notifyEmail.cjs');
app.use(notifyEmail);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  console.log('Note: MongoDB connection may fail if IP is not whitelisted in Atlas');
  console.log('Static endpoints (income, billing, etc.) will still work');
}); 