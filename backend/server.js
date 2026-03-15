/**
 * ═══════════════════════════════════════════════════════════════════════
 *  DAWATIME BACKEND SERVER
 * ═══════════════════════════════════════════════════════════════════════
 * 
 *  A complete backend for the Dawatime Hotel Booking mobile app.
 * 
 *  Features:
 *    • User authentication (register, login, JWT tokens)
 *    • Password reset flow (forgot → OTP → new password)
 *    • Hotel listing and detail APIs
 *    • Booking management (create, list, remove)
 *    • Screen-flow enforcement (users can't skip required steps)
 *    • Request validation on all endpoints
 * 
 *  Tech stack:
 *    • Express.js   — HTTP server & routing
 *    • SQLite       — File-based database (zero config)
 *    • JWT          — Stateless authentication tokens
 *    • bcrypt       — Password hashing
 * 
 *  Run:  npm start  (or npm run dev for auto-reload)
 * ═══════════════════════════════════════════════════════════════════════
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import route modules
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const bookingRoutes = require('./routes/bookings');

// Import database seeder
const { seedHotels } = require('./config/seed');

// ─── INITIALISE EXPRESS APP ─────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────────────────

// Enable CORS so the mobile app can make requests from any origin
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Log every incoming request for debugging purposes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`  [${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ─── MOUNT ROUTES ───────────────────────────────────────────────────

// Authentication routes (register, login, forgot-password, etc.)
app.use('/api/auth', authRoutes);

// Hotel routes (list, detail)
app.use('/api/hotels', hotelRoutes);

// Booking routes (create, list, delete)
app.use('/api/bookings', bookingRoutes);

// ─── HEALTH CHECK ENDPOINT ──────────────────────────────────────────
// Quick way to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dawatime Backend is running!',
    timestamp: new Date().toISOString(),
  });
});

// ─── ROOT ENDPOINT ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Dawatime Hotel Booking API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        forgotPassword: 'POST /api/auth/forgot-password',
        verifyOtp: 'POST /api/auth/verify-otp',
        resetPassword: 'POST /api/auth/reset-password',
        profile: 'GET /api/auth/me',
      },
      hotels: {
        list: 'GET /api/hotels',
        detail: 'GET /api/hotels/:id',
      },
      bookings: {
        create: 'POST /api/bookings',
        list: 'GET /api/bookings',
        remove: 'DELETE /api/bookings/:id',
      },
    },
  });
});

// ─── 404 HANDLER ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

// ─── GLOBAL ERROR HANDLER ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

// ─── START THE SERVER ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║       🏨 DAWATIME BACKEND SERVER                ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Server running on http://0.0.0.0:${PORT}        ║`);
  console.log('║  Accessible from all devices on your network    ║');
  console.log('║  Press Ctrl+C to stop                           ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Seed the database with hotel data on first run
  seedHotels();
});

module.exports = app;
