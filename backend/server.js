require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('./models/User');
const SearchHistory = require('./models/SearchHistory');
const authMiddleware = require('./auth');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search', authMiddleware, async (req, res) => {
  try {
    const { query, count = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        api_key: process.env.SERPAPI_KEY,
        q: query,
        num: count,
        engine: 'google'
      }
    });

    const results = response.data.organic_results?.map(item => ({
      name: item.title,
      url: item.link,
      snippet: item.snippet
    })) || [];

    res.json({ 
      query, 
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/history', authMiddleware, async (req, res) => {
  try {
    const { query, results, notes } = req.body;
    
    const history = new SearchHistory({
      userId: req.userId,
      query,
      results,
      notes: notes || ''
    });
    
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', authMiddleware, async (req, res) => {
  try {
    const history = await SearchHistory.find({ userId: req.userId })
      .sort({ searchedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history/:id', authMiddleware, async (req, res) => {
  try {
    const history = await SearchHistory.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!history) {
      return res.status(404).json({ error: 'History item not found' });
    }
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/history/:id', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    const history = await SearchHistory.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { notes },
      { new: true }
    );
    
    if (!history) {
      return res.status(404).json({ error: 'History item not found' });
    }
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history/:id', authMiddleware, async (req, res) => {
  try {
    const history = await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!history) {
      return res.status(404).json({ error: 'History item not found' });
    }
    
    res.json({ message: 'History item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history', authMiddleware, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.userId });
    res.json({ message: 'All history cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));