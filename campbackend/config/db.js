const { initializeFirebase } = require('./firebase');

const connectDB = async () => {
  try {
    initializeFirebase();
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;