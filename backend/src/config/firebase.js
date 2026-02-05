const admin = require('firebase-admin');

let isInitialized = false;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        isInitialized = true;
        console.log('Firebase Admin Initialized');
    } else {
        console.warn('FIREBASE_SERVICE_ACCOUNT not found. Notifications will be mocked.');
    }
} catch (error) {
    console.error('Firebase Initialization Error:', error.message);
}

module.exports = { admin, isInitialized };
