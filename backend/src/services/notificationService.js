const admin = require('../lib/firebaseAdmin');
const prisma = require('../config/prisma');

/**
 * Sends a push notification to a user's registered FCM token.
 * 
 * @param {string} userId - The ID of the user to send the notification to.
 * @param {string} title - The notification title.
 * @param {string} body - The notification body text.
 * @param {object} data - Optional extra data payload to send with the notification.
 * @returns {Promise<boolean>} - True if sent successfully, false otherwise.
 */
const sendPushNotification = async (userId, title, body, data = {}) => {
    try {
        // Skip if firebase admin isn't properly initialized
        if (!admin.apps.length) {
            console.warn(`[FCM] Skipped sending notification to ${userId}: Firebase not initialized.`);
            return false;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { fcmToken: true }
        });

        if (!user || !user.fcmToken) {
            console.warn(`[FCM] User ${userId} has no registered FCM token.`);
            return false;
        }

        const message = {
            notification: {
                title,
                body
            },
            data: {
                // FCM data payload requires all values to be strings
                ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
                type: 'notification'
            },
            token: user.fcmToken
        };

        const response = await admin.messaging().send(message);
        console.log(`[FCM] Successfully sent message to ${userId}:`, response);
        return true;
    } catch (error) {
        console.error(`[FCM] Error sending message to user ${userId}:`, error.message);

        // If the token is invalid or unregistered, we might want to remove it from the database
        if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
            console.log(`[FCM] Removing invalid token for user ${userId}`);
            await prisma.user.update({
                where: { id: userId },
                data: { fcmToken: null }
            });
        }

        return false;
    }
};

module.exports = {
    sendPushNotification
};
