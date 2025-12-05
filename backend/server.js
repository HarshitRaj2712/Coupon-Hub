// server.js (or index.js) — corrected mongoose connect usage
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend origin and allow credentials (cookies)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// connect mongo — do NOT pass legacy options that are unsupported
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/couponhub';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

// routes
app.use('/api/auth', authRoutes);

// example protected route
app.get('/api/me', requireAuth, async (req, res) => {
  // req.user filled by middleware
  res.json({ user: req.user });
});

app.listen(PORT, () => console.log(`Auth server listening on ${PORT}`));
