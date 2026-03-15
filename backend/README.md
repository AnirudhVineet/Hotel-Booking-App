# Dawatime Backend Server

Complete backend for the **Dawatime Hotel Booking** mobile app.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js + Express** | HTTP server & REST API routing |
| **SQLite (better-sqlite3)** | Zero-config file-based database |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **bcryptjs** | Secure password hashing |

## Quick Start

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# For development with auto-reload:
npm run dev
```

The server starts on **http://localhost:5000** by default.  
The SQLite database file (`dawatime.db`) is created automatically on first run.

## Connecting the Mobile App

The frontend already has an API client at `mobile-app/utils/api.ts`.

- **Android Emulator**: Automatically uses `http://10.0.2.2:5000` (maps to host localhost)
- **iOS Simulator**: Uses `http://localhost:5000`
- **Physical Device**: Update `BASE_URL` in `mobile-app/utils/api.ts` to your computer's local IP (e.g. `http://192.168.1.100:5000/api`)

Install the AsyncStorage dependency in the mobile app (if not already installed):

```bash
cd mobile-app
npx expo install @react-native-async-storage/async-storage
```

## API Endpoints

### Authentication

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | `{ name, email, password }` | No | Create account, returns JWT |
| POST | `/api/auth/login` | `{ email, password }` | No | Sign in, returns JWT |
| POST | `/api/auth/forgot-password` | `{ email }` | No | Send OTP to email |
| POST | `/api/auth/verify-otp` | `{ email, otp }` | No | Verify OTP code |
| POST | `/api/auth/reset-password` | `{ email, otp, newPassword }` | No | Reset password |
| GET | `/api/auth/me` | — | Yes | Get current user profile |

### Hotels

| Method | Endpoint | Query Params | Auth | Description |
|--------|----------|-------------|------|-------------|
| GET | `/api/hotels` | `?category=Villas&search=horizon` | Yes | List/filter hotels |
| GET | `/api/hotels/:id` | — | Yes | Hotel detail (updates flow state) |

### Bookings

| Method | Endpoint | Body | Auth | Flow Guard | Description |
|--------|----------|------|------|-----------|-------------|
| POST | `/api/bookings` | `{ hotelId }` | Yes | `hotel_viewed` | Create booking |
| GET | `/api/bookings` | — | Yes | — | List user's bookings |
| DELETE | `/api/bookings/:id` | — | Yes | — | Remove a booking |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/` | API endpoint directory |

## Screen Flow Enforcement

The backend tracks each user's progress through a flow state machine:

```
registered → logged_in → hotel_viewed → booking_started → booking_confirmed
```

- A user **cannot create a booking** unless they have **viewed at least one hotel** first
- The flow state is stored per-user in the `user_flow_state` table
- Flow only advances forward (never regresses)

## Project Structure

```
backend/
├── server.js              # Entry point — mounts routes, starts server
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (PORT, JWT_SECRET)
├── config/
│   ├── database.js        # SQLite database init & table creation
│   └── seed.js            # Seeds hotel data on first run
├── middleware/
│   ├── auth.js            # JWT token verification middleware
│   └── flowGuard.js       # Screen-flow enforcement middleware
└── routes/
    ├── auth.js            # Register, login, password reset endpoints
    ├── hotels.js          # Hotel listing and detail endpoints
    └── bookings.js        # Booking CRUD endpoints
```
