/**
 * ─── JWT AUTHENTICATION MIDDLEWARE ──────────────────────────────────
 * 
 * Protects routes by verifying the JWT token from the Authorization header.
 * 
 * Usage:  router.get('/protected', authenticate, handler);
 * 
 * Expected header format:  Authorization: Bearer <token>
 * 
 * On success → attaches req.user = { id, email, name }
 * On failure → returns 401 Unauthorized
 */

const jwt = require('jsonwebtoken');
const db = require('../config/database');

function authenticate(req, res, next) {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look up the user in the database to ensure they still exist
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    // Attach user info to the request object for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
}

module.exports = authenticate;
