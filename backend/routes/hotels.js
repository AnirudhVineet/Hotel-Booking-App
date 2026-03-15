/**
 * ─── HOTEL ROUTES ───────────────────────────────────────────────────
 * 
 * Handles hotel listing and detail retrieval:
 *   GET /api/hotels       → List all hotels (with optional category filter)
 *   GET /api/hotels/:id   → Get a single hotel by ID (updates flow state)
 * 
 * All routes are protected — user must be authenticated.
 */

const express = require('express');
const db = require('../config/database');
const authenticate = require('../middleware/auth');
const { updateFlowState } = require('../middleware/flowGuard');

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════
// GET /api/hotels  —  List all hotels
// ═══════════════════════════════════════════════════════════════════════
// Query params:
//   ?category=Villas    → Filter by category (Hotels, Villas, Apartments)
//   ?search=horizon     → Search by title or location
router.get('/', authenticate, (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM hotels';
    const params = [];
    const conditions = [];

    // Apply category filter if provided
    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    // Apply search filter if provided
    if (search) {
      conditions.push('(title LIKE ? OR location LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Build the WHERE clause
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const hotels = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: hotels,
      count: hotels.length,
    });
  } catch (error) {
    console.error('List hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/hotels/:id  —  Get a single hotel by ID
// ═══════════════════════════════════════════════════════════════════════
// Also advances the user's flow state to "hotel_viewed" so they can
// proceed to the booking step.
router.get('/:id', authenticate, (req, res) => {
  try {
    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found.',
      });
    }

    // ── Flow state update ───────────────────────────────────────
    // Mark that this user has viewed a hotel (required before booking)
    updateFlowState(req.user.id, 'hotel_viewed');

    // Check if this hotel is already booked by the current user
    const booking = db.prepare(
      'SELECT id FROM bookings WHERE user_id = ? AND hotel_id = ?'
    ).get(req.user.id, req.params.id);

    res.json({
      success: true,
      data: {
        ...hotel,
        isBooked: !!booking,
      },
    });
  } catch (error) {
    console.error('Hotel detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

module.exports = router;
