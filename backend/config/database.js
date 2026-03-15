const Database = require('better-sqlite3');
const path = require('path');

// Database file stored alongside the backend code
const DB_PATH = path.join(__dirname, '..', 'dawatime.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// ─── TABLE CREATION ─────────────────────────────────────────────────

db.exec(`
  -- Users table: stores account credentials and profile info
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Hotels table: stores all hotel listings
  CREATE TABLE IF NOT EXISTS hotels (
    id            TEXT PRIMARY KEY,
    title         TEXT NOT NULL,
    location      TEXT NOT NULL,
    price         TEXT NOT NULL,
    original_price TEXT,
    rating        TEXT NOT NULL DEFAULT '0',
    reviews_count INTEGER DEFAULT 0,
    description   TEXT,
    category      TEXT DEFAULT 'Hotels',
    image_url     TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Bookings table: links users to hotels they have booked
  CREATE TABLE IF NOT EXISTS bookings (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    hotel_id    TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    UNIQUE(user_id, hotel_id)
  );

  -- OTP codes table: stores temporary codes for password reset
  CREATE TABLE IF NOT EXISTS otp_codes (
    id          TEXT PRIMARY KEY,
    email       TEXT NOT NULL,
    code        TEXT NOT NULL,
    expires_at  DATETIME NOT NULL,
    used        INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- User flow state: tracks how far a user has progressed in the app
  -- This enables screen-flow enforcement (e.g. can't book without viewing a hotel)
  CREATE TABLE IF NOT EXISTS user_flow_state (
    user_id     TEXT PRIMARY KEY,
    state       TEXT NOT NULL DEFAULT 'registered',
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;
