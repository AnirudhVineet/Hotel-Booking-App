const db = require('./config/database');

console.log('--- DB CLEANUP START ---');

try {
  const clean = db.transaction(() => {
    console.log('Clearing bookings...');
    db.prepare('DELETE FROM bookings').run();
    
    console.log('Clearing user states...');
    db.prepare('DELETE FROM user_flow_state').run();
    
    console.log('Clearing OTP codes...');
    db.prepare('DELETE FROM otp_codes').run();
    
    console.log('Clearing user accounts...');
    db.prepare('DELETE FROM users').run();
  });

  clean();
  console.log('--- SUCCESS: User data cleared! ---');
} catch (error) {
  console.error('FAILED to clear database:', error.message);
}

process.exit(0);
