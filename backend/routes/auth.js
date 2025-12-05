const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30', 10);

// helpers
function signAccessToken(user) {
  const payload = { id: user._id.toString(), email: user.email, roles: user.roles || [] };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES });
}

function generateRefreshTokenString() {
  return crypto.randomBytes(64).toString('hex'); // long random token
}

// cookie options for refresh token
function cookieOptions() {
  const secure = process.env.COOKIE_SECURE === 'true';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/api/auth', // only send cookie to auth routes
    maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  };
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name = '', email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email: email.toLowerCase(), passwordHash });
    await user.save();

    // tokens
    const accessToken = signAccessToken(user);
    const refreshTokenString = generateRefreshTokenString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create({ token: refreshTokenString, user: user._id, expiresAt });

    // set cookie (httpOnly)
    res.cookie('refreshToken', refreshTokenString, cookieOptions());

    res.status(201).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, roles: user.roles }
    });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // create tokens
    const accessToken = signAccessToken(user);
    // rotate: create new refresh token and store
    const refreshTokenString = generateRefreshTokenString();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: refreshTokenString, user: user._id, expiresAt });

    res.cookie('refreshToken', refreshTokenString, cookieOptions());

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, roles: user.roles }
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/refresh
// reads refresh token from httpOnly cookie, verifies it exists in DB and not expired,
// then issues a new access token and rotates refresh token (optional).
router.post('/refresh', async (req, res) => {
  try {
    const refreshTokenString = req.cookies?.refreshToken;
    if (!refreshTokenString) return res.status(401).json({ message: 'No refresh token' });

    // find token in DB
    const tokenDoc = await RefreshToken.findOne({ token: refreshTokenString, revoked: false });
    if (!tokenDoc) {
      // possible token reuse or invalid token
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (tokenDoc.expiresAt < new Date()) {
      // expired - remove it
      await RefreshToken.deleteOne({ _id: tokenDoc._id });
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // find user
    const user = await User.findById(tokenDoc.user);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // rotate refresh token: create new refresh, remove old
    const newRefresh = generateRefreshTokenString();
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    // delete old token and save new
    await RefreshToken.deleteOne({ _id: tokenDoc._id });
    await RefreshToken.create({ token: newRefresh, user: user._id, expiresAt: newExpiresAt });

    // set cookie with new refresh token
    res.cookie('refreshToken', newRefresh, cookieOptions());

    // issue new access token
    const accessToken = signAccessToken(user);

    res.json({ accessToken });
  } catch (err) {
    console.error('refresh error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
// revoke refresh token and clear cookie
router.post('/logout', async (req, res) => {
  try {
    const refreshTokenString = req.cookies?.refreshToken;
    if (refreshTokenString) {
      await RefreshToken.deleteOne({ token: refreshTokenString }); // remove from DB
      res.clearCookie('refreshToken', cookieOptions());
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('logout error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
