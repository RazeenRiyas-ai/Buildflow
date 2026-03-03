const admin = require('firebase-admin');

// Ensure to handle cases where these env vars might not be set yet during development
if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Handle newline characters in the private key string from .env
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('✅ Firebase Admin SDK initialized successfully.');
        } else {
            console.warn('⚠️ Firebase Admin SDK config is missing. Push notifications will be disabled.');
        }
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    }
}

module.exports = admin;
