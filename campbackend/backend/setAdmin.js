const mongoose = require('mongoose');
const User = require('./models/User');

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_aid');

    // Replace with an actual user email
    const email = 'admin@somaiya.edu';
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`User ${user.email} set as admin`);
    } else {
      console.log('User not found. Please create the user first.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAdmin();