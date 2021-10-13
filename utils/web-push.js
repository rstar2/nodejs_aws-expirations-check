const webPush = require('web-push');

const dbWebPush = require('../lib/db-web-push');


const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_BASE_URL = process.env.VAPID_BASE_URL;

webPush.setVapidDetails(VAPID_BASE_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * Send Push notifications to the subscribed user
 */
exports.sendNotification = async function (user, message) {
    const subscriptions = await dbWebPush.dbList(user);
  
    subscriptions.forEach((subscription) => {
        sendNotification_(user, subscription, message);
    });
};

function sendNotification_(user, subscription, payload) {
    webPush
        .sendNotification(subscription, payload)
        .then(() => {
            console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
        })
        .catch((error) => {
            console.log(
                'ERROR in sending Notification, endpoint will be removed ' + subscription.endpoint,
                error
            );
            // delete failed subscription
            dbWebPush.dbDelete(user, subscription);
        });
}
