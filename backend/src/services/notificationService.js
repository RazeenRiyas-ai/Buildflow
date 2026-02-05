const { admin, isInitialized } = require('../config/firebase');

const sendPushNotification = async (token, title, body, data = {}) => {
    if (!token) return;

    // MOCK MODE: Log if not connected
    if (!isInitialized) {
        console.log(`[MOCK FCM] To: ${token.substring(0, 10)}... | Title: ${title} | Body: ${body}`);
        return;
    }

    try {
        await admin.messaging().send({
            token,
            notification: {
                title,
                body
            },
            data
        });
        console.log('FCM Notification Sent');
    } catch (error) {
        console.error('FCM Send Error:', error.message);
    }
};

module.exports = { sendPushNotification };
