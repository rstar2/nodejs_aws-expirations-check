const webPush = require('web-push');

const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_BASE_URL = process.env.VAPID_BASE_URL || process.env.BASE_URL;

webPush.setVapidDetails(VAPID_BASE_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * Send Push notifications to the subscribed user
 */
exports.sendNotification = async function (user, message) {
    const subscriptions = await getPushSubscriptions(uid);
  
    subscriptions.forEach((subscription) => {
        sendNotification_(subscription, message);
    });
};

function sendNotification_(subscription, payload) {
    webPush
        .sendNotification(subscription, payload)
        .then(() => {
            console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
        })
        .catch((error) => {
            console.log(
                'ERROR in sending Notification, endpoint removed ' + subscription.endpoint,
                error
            );
            // delete failed subscription
            deletePushSubscription(subscription.endpoint);
        });
}

function getPushSubscriptions() {

}

function deletePushSubscription() {

}  
