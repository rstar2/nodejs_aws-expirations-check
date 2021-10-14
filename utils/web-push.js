const webPush = require('web-push');

const dbWebPush = require('../lib/db-web-push');


const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_BASE_URL = process.env.VAPID_BASE_URL;

webPush.setVapidDetails(VAPID_BASE_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * Send Push notifications to the subscribed user
 * @param {string} userID
 */
exports.send = async function (userID, message) {
    const subscriptions = await dbWebPush.dbList(userID);
  
    subscriptions.forEach((subscription) => {
        sendNotification(userID, subscription, message);
    });
};

/**
 * 
 * @param {string} userID 
 * @param {PushSubscription} subscription 
 * @param {string} message 
 */
function sendNotification(userID, subscription, message) {
    console.log('Push Application Server - Notification send to', userID, subscription.endpoint);
    webPush
        .sendNotification(subscription, message)
        .then(() => {
            console.log('Push Application Server - Notification sent to', subscription.endpoint);
        })
        .catch((error) => {
            console.log(
                'ERROR in sending Notification, endpoint will be removed', subscription.endpoint,
                error
            );
            // delete failed subscription
            dbWebPush.dbDelete(userID, subscription);
        });
}
