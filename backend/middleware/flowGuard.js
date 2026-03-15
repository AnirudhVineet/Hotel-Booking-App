/**
 * ─── FLOW GUARD MIDDLEWARE ──────────────────────────────────────────
 * 
 * Enforces sequential screen flow so users cannot skip required steps.
 * 
 * Each user has a flow state tracked in the `user_flow_state` table.
 * The states form an ordered progression:
 * 
 *   registered → logged_in → hotel_viewed → booking_started → booking_confirmed
 * 
 * Usage:
 *   router.post('/bookings', authenticate, requireFlow('hotel_viewed'), handler);
 *   
 *   This ensures the user has at least viewed a hotel before creating a booking.
 * 
 * The middleware is a factory function — call it with the minimum required state
 * and it returns the actual middleware function.
 */

const db = require('../config/database');

// ─── FLOW STATE ORDER (lower index = earlier in flow) ───────────────
const FLOW_STATES = [
  'registered',       // User has created an account
  'logged_in',        // User has logged in
  'hotel_viewed',     // User has viewed at least one hotel detail page
  'booking_started',  // User has initiated a booking
  'booking_confirmed' // User has confirmed a booking
];

/**
 * Get the numeric index of a flow state for comparison
 */
function getStateIndex(state) {
  const index = FLOW_STATES.indexOf(state);
  return index === -1 ? -1 : index;
}

/**
 * Update a user's flow state (only advances forward, never goes backward)
 */
function updateFlowState(userId, newState) {
  const current = db.prepare('SELECT state FROM user_flow_state WHERE user_id = ?').get(userId);

  if (!current) {
    // First time — insert the state
    db.prepare(
      'INSERT INTO user_flow_state (user_id, state, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
    ).run(userId, newState);
    return;
  }

  // Only advance forward (don't regress)
  if (getStateIndex(newState) > getStateIndex(current.state)) {
    db.prepare(
      'UPDATE user_flow_state SET state = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).run(newState, userId);
  }
}

/**
 * Factory function: returns middleware that checks if the user has reached
 * the required flow state before allowing access.
 * 
 * @param {string} requiredState - The minimum flow state the user must have
 * @returns {Function} Express middleware
 */
function requireFlow(requiredState) {
  return (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Look up the user's current flow state
    const record = db.prepare('SELECT state FROM user_flow_state WHERE user_id = ?').get(userId);
    const currentState = record ? record.state : 'registered';
    const currentIndex = getStateIndex(currentState);
    const requiredIndex = getStateIndex(requiredState);

    if (currentIndex < requiredIndex) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You must complete the "${requiredState}" step first.`,
        currentState,
        requiredState,
      });
    }

    next();
  };
}

module.exports = { requireFlow, updateFlowState, FLOW_STATES };
