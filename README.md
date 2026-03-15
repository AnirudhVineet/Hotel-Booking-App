# Hotel-Booking-App
The Hotel Booking App is a full-stack mobile application built with React Native and Node.js/Express, where users can register, browse hotels, and manage reservations through RESTful APIs. It uses in-memory mock data instead of a live database and demonstrates key concepts like authentication, API integration, and client–server architecture.


# Running the App Locally

To run the application, both the backend server and mobile app must run on the same local network.

---

1. Start the Backend Server

Open a terminal and navigate to the backend directory:

cd backend

Install dependencies:

npm install

Start the backend server:

npm start

The server will start at:

http://localhost:5000

or

http://0.0.0.0:5000

Keep this terminal window running.

---

2. Configure the Mobile App API URL

Since the mobile app runs on a physical device, it must connect to your computer using your local network IP address.

Find your computer's IP address

Windows

Open Command Prompt and run:

ipconfig

Look for:

IPv4 Address

Example:

192.168.1.5

Mac / Linux

Run:

ifconfig

or

ipconfig getifaddr en0

Update the API Configuration

Open the following file:

mobile-app/utils/api.ts

Locate the LOCAL_IP variable and replace it with your computer's IP address:

const LOCAL_IP = "192.168.1.X"

Example:

const LOCAL_IP = "192.168.1.5"

---

3. Start the Mobile Application

Open a new terminal window and navigate to the mobile app directory:

cd mobile-app

Install dependencies:

npm install

Start the Expo development server:

npx expo start --clear

The --clear flag ensures the bundler removes cached data.

---

4. Run the App

1. A QR code will appear in your terminal.
1. Open the Expo Go app on your phone.
1. Scan the QR code.

Make sure your phone and computer are on the same Wi-Fi network.

OR

1. Download and open the apk file

---

# Features

Authentication

- User registration
- Secure login
- Password reset functionality

Hotel Browsing

- View available hotels
- Filter hotels by category
- Explore hotel listings easily

Hotel Details

- Detailed hotel information
- Amenities overview
- Location information

Booking Management

- Book hotel rooms
- View active bookings
- Cancel existing bookings

Messaging Interface

- Chat UI for viewing messages  
  (mock data used for demonstration)

User Profile

- Manage profile information
- App settings access

---

# Prerequisites

Before running the project, make sure you have the following installed:

Node.js (v16 or higher)  
https://nodejs.org/

npm (included with Node.js)

Expo Go App on your phone  
https://expo.dev/client

---

# Project Structure

The repository is divided into two main components:

Dawatime-Assignment/
│
├── backend/ Node.js + Express API server
│
└── mobile-app/ React Native mobile application (Expo)

Backend  
Handles:

- authentication
- API endpoints
- hotel data
- booking logic
- mock database

Mobile App  
Handles:

- user interface
- API communication
- navigation
- booking flow

---

Troubleshooting

Network Error / Server Timeout

If the mobile app cannot connect to the backend:

- Ensure the LOCAL_IP in api.ts is correct
- Confirm your phone and computer are on the same Wi-Fi network
- Make sure port 5000 is not blocked by your firewall

Expo Bundler Issues

If Expo throws unexpected errors, restart it using:

npx expo start --clear

This clears cached builds and resolves most bundler issues.
