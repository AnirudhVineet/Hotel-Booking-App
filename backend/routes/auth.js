const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const authenticate = require('../middleware/auth');
const { updateFlowState } = require('../middleware/flowGuard');

const router = express.Router();

// ─── HELPER: Generate a JWT token for a user ────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ─── HELPER: Generate a 4-digit OTP code ────────────────────────────
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/register  —  Create a new user account
// ═══════════════════════════════════════════════════════════════════════
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validation ────────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // ── Check for existing user ───────────────────────────────────
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // ── Create the user ───────────────────────────────────────────
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 12);

    db.prepare(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)'
    ).run(userId, name.trim(), email.toLowerCase().trim(), hashedPassword);

    // Initialise the user's flow state as "registered"
    updateFlowState(userId, 'registered');

    // Generate a JWT token so the user is immediately logged in
    const user = { id: userId, email: email.toLowerCase() };
    const token = generateToken(user);

    // Advance flow to "logged_in" since registration includes auto-login
    updateFlowState(userId, 'logged_in');

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: { id: userId, name: name.trim(), email: email.toLowerCase() },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/login  —  Sign in with email & password
// ═══════════════════════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validation ────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // ── Find user by email ────────────────────────────────────────
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Verify password ───────────────────────────────────────────
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Generate token & update flow state ────────────────────────
    const token = generateToken(user);
    updateFlowState(user.id, 'logged_in');

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/forgot-password  —  Request a password reset OTP
// ═══════════════════════════════════════════════════════════════════════
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    // Check if the user exists
    const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      // For security, don't reveal whether the email exists
      return res.json({
        success: true,
        message: 'If an account with that email exists, an OTP has been sent.',
      });
    }

    // Generate a 4-digit OTP code
    const otpCode = generateOTP();
    const otpId = uuidv4();

    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate any previous OTP codes for this email
    db.prepare('UPDATE otp_codes SET used = 1 WHERE email = ? AND used = 0').run(email.toLowerCase());

    // Store the new OTP
    db.prepare(
      'INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)'
    ).run(otpId, email.toLowerCase(), otpCode, expiresAt);

    // In production, you would send this OTP via email.
    // For development/testing, we log it to the console.
    console.log(`\n  📧 OTP for ${email}: ${otpCode}\n`);

    res.json({
      success: true,
      message: 'If an account with that email exists, an OTP has been sent.',
      // DEV ONLY: Include OTP in response for testing (remove in production!)
      dev_otp: otpCode,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/verify-otp  —  Verify the OTP code
// ═══════════════════════════════════════════════════════════════════════
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      });
    }

    // Find a valid unused OTP for this email
    const otpRecord = db.prepare(
      'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND used = 0 ORDER BY created_at DESC LIMIT 1'
    ).get(email.toLowerCase(), otp);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code.',
      });
    }

    // Check if OTP has expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/reset-password  —  Set a new password
// ═══════════════════════════════════════════════════════════════════════
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Verify the OTP one more time
    const otpRecord = db.prepare(
      'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND used = 0 ORDER BY created_at DESC LIMIT 1'
    ).get(email.toLowerCase(), otp);

    if (!otpRecord || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.',
      });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, email.toLowerCase());

    // Mark the OTP as used
    db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(otpRecord.id);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/auth/me  —  Get current user profile (protected)
// ═══════════════════════════════════════════════════════════════════════
router.get('/me', authenticate, (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    // Also get the user's flow state
    const flowState = db.prepare(
      'SELECT state FROM user_flow_state WHERE user_id = ?'
    ).get(req.user.id);

    res.json({
      success: true,
      data: {
        ...user,
        flowState: flowState ? flowState.state : 'registered',
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

module.exports = router;
