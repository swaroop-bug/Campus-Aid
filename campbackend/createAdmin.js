require('dotenv').config();
const { initializeFirebase, getDb } = require('./config/firebase');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    console.log('🚀 Connecting to Firebase...');
    const db = initializeFirebase();

    const email = 'admin@somaiya.edu';
    const password = 'adminpassword'; // YOU SHOULD CHANGE THIS LATER!
    const name = 'Admin User';

    console.log(`🔍 Checking if user ${email} exists...`);
    const existing = await db.collection('users').where('email', '==', email).get();

    if (!existing.empty) {
      console.log('⚠️ User already exists. Updating to admin role...');
      const userDoc = existing.docs[0];
      await userDoc.ref.update({ role: 'admin' });
      console.log('✅ User updated to admin.');
    } else {
      console.log('🆕 Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').add({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
