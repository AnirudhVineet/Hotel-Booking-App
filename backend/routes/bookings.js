/**
 * ─── BOOKING ROUTES ─────────────────────────────────────────────────
 * 
 * Handles hotel booking operations:
 *   POST   /api/bookings      → Create a new booking (requires hotel_viewed flow)
 *   GET    /api/bookings       → List all bookings for the current user
 *   DELETE /api/bookings/:id   → Remove a booking
 * 
 * All routes are protected and some require specific flow states to
 * enforce the screen-by-screen navigation rule.
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const authenticate = require('../middleware/auth');
const { requireFlow, updateFlowState } = require('../middleware/flowGuard');

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════
// POST /api/bookings  —  Create a new booking
// ═══════════════════════════════════════════════════════════════════════
// Flow guard: user must have at least reached "hotel_viewed" state.
// This means a user who hasn't viewed any hotel detail page CANNOT book.
router.post('/', authenticate, requireFlow('hotel_viewed'), (req, res) => {
  try {
    const { hotelId } = req.body;
    const userId = req.user.id;

    // ── Validation ────────────────────────────────────────────────
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'hotelId is required.',
      });
    }

    // Check that the hotel exists
    const hotel = db.prepare('SELECT id, title FROM hotels WHERE id = ?').get(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found.',
      });
    }

    // Check for duplicate booking
    const existing = db.prepare(
      'SELECT id FROM bookings WHERE user_id = ? AND hotel_id = ?'
    ).get(userId, hotelId);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already booked this hotel.',
      });
    }

    // ── Create the booking ────────────────────────────────────────
    const bookingId = uuidv4();
    db.prepare(
      'INSERT INTO bookings (id, user_id, hotel_id) VALUES (?, ?, ?)'
    ).run(bookingId, userId, hotelId);

    // Advance flow state to "booking_confirmed"
    updateFlowState(userId, 'booking_confirmed');

    res.status(201).json({
      success: true,
      message: `Successfully booked "${hotel.title}".`,
      data: {
        bookingId,
        hotelId,
        hotelTitle: hotel.title,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/bookings  —  List all bookings for the current user
// ═══════════════════════════════════════════════════════════════════════
router.get('/', authenticate, (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT 
        b.id AS booking_id,
        b.created_at AS booked_at,
        h.id AS hotel_id,
        h.title,
        h.location,
        h.price,
        h.rating,
        h.reviews_count,
        h.description,
        h.image_url,
        h.category
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(req.user.id);

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error('List bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// DELETE /api/bookings/:id  —  Remove a booking
// ═══════════════════════════════════════════════════════════════════════
router.delete('/:id', authenticate, (req, res) => {
  try {
    // Verify the booking belongs to the current user
    const booking = db.prepare(
      'SELECT id FROM bookings WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or does not belong to you.',
      });
    }

    // Delete the booking
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Booking removed successfully.',
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});

module.exports = router;
