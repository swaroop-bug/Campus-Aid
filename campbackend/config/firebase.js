const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db;

const initializeFirebase = () => {
  try {
    // Try loading service account key from file first
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('🔥 Firebase initialized with service account key file');
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      console.log('🔍 Checking Firebase Env Vars:');
      console.log(`- Project ID: ${projectId ? 'Found' : 'MISSING'}`);
      console.log(`- Client Email: ${clientEmail ? 'Found' : 'MISSING'}`);
      console.log(`- Private Key: ${privateKey ? 'Found (' + privateKey.length + ' chars)' : 'MISSING'}`);

      if (projectId && clientEmail && privateKey) {
        // Handle both literal newlines and escaped \n
        privateKey = privateKey.replace(/\\n/g, '\n');
        
        // Ensure the key starts and ends with the correct guards if missing
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            console.warn('⚠️ Private key missing header, check your env vars!');
        }

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey,
            clientEmail,
          }),
        });
        console.log('🔥 Firebase initialized with environment variables');
      } else {
        console.error('❌ Missing Firebase environment variables on Render!');
        console.log('💡 Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to the Render Dashboard.');
      }
    }

    const { getFirestore } = require('firebase-admin/firestore');
    
    try {
      db = getFirestore(admin.app(), "default");
    } catch {
      db = admin.firestore();
    }
    console.log('✅ Firestore connected');
    return db;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return db;
};

module.exports = { admin, initializeFirebase, getDb };