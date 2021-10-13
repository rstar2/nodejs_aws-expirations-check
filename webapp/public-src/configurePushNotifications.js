/* eslint-disable no-console */

// https://developers.google.com/web/fundamentals/push-notifications/
// https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
// https://www.blog.plint-sites.nl/how-to-add-push-notifications-to-a-progressive-web-app/

/**
 * @type {(swRegistration: ServiceWorkerRegistration) => void}
 */
let swResolve;
/**
 * @type {Promise<ServiceWorkerRegistration>}
 */
const swRegistrationPromise = new Promise((aSwResolve) => {
    swResolve = aSwResolve;
});

/**
 * @type {PushSubscription}
 */
let pushSubscription;

/**
 * @type {(subscription: PushSubscription|undefined, oldSubscription: PushSubscription|undefined) => void}
 */
let handleSubscription;

// configure VAPID keys for instance with https://web-push-codelab.glitch.me/
const applicationServerPublicKey = process.env.VAPID_PUBLIC_KEY;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * @return {Promise<Boolean>}
 */
function requestNotificationPermission() {
    // NOTE: the Promise API is the new way but if we want to support old callback style API
    // we have to implement both
    //   return Notification.requestPermission().then(permission => {
    //     // if granted, create new subscription
    //     if (permission !== 'granted') throw new Error('Client Notifications not granted');
    //   });

    return new Promise((resolve, reject) => {
        const permissionPromise = Notification.requestPermission(result => {
            // old callback Notification API
            resolve(result);
        });

        // check if new Promise NotificationAPI
        if (permissionPromise) {
            permissionPromise.then(resolve, reject);
        }
    }).then(permission => {
        if (permission !== 'granted') {
            throw new Error('Client Notifications not granted');
        }
    });
}

/**
 * 
 * @param {PushSubscription} subscription 
 * @param {PushSubscription} oldSubscription 
 */
function updateSubscriptionOnServer(subscription, oldSubscription) {
    if (handleSubscription) {
        console.log('Update push subscription on server for', subscription, oldSubscription);
        handleSubscription(subscription, oldSubscription);
    }
}


export const notificationsSupported = 'Notification' in window && navigator.serviceWorker;

/**
 * This must be called (and thus configured) before
 * any "other" module importing the other exported functions
 * @param {ServiceWorkerRegistration} swReg
 */
export default swReg => {
    swResolve(swReg);

    swRegistrationPromise.then(() => {
        // try go get any current subscription
        hasSubscription().then(() => {
            if (!pushSubscription) {
                // for testing immediately create subscription now if there's none,
                // otherwise it's called after authorization is complete 
                // createSubscription();
            }
        });
    });
};

/**
 * @return {Promise<Boolean>}
 */
export function hasSubscription() {
    if (!notificationsSupported) return Promise.reject(new Error('Client Notifications not supported'));

    return swRegistrationPromise
        .then(swRegistration => swRegistration.pushManager.getSubscription())
        .then(subscription => {
            if (!pushSubscription || pushSubscription.endpoint !== subscription.endpoint) {
                updateSubscriptionOnServer(subscription, pushSubscription);
            }
            pushSubscription = subscription;
            return !!subscription;
        })
        .catch(error => {
            updateSubscriptionOnServer(undefined, pushSubscription);
            pushSubscription = undefined;
            throw error; // rethrow the same rejected error
        });
}

/**
 * Request/Check permission to use Notification API and if granted configure Push Notifications.
 * @return {Promise<PushSubscription}
 */
export function createSubscription() {
    if (!notificationsSupported) return Promise.reject(new Error('Client Notifications not supported'));

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    return requestNotificationPermission()
        .then(() => swRegistrationPromise)
        .then(swRegistration =>
            // this will also return current returned Push subscription if any
            // Permissions and subscribe()
            //There is one side effect of calling subscribe(). If your web app doesn't have permissions for showing notifications
            // at the time of calling subscribe(), the browser will request the permissions for you.
            // This is useful if your UI works with this flow, but if you want more control  stick to the Notification.requestPermission() API.
            swRegistration.pushManager.subscribe({
                // The userVisibleOnly parameter is basically an admission that you will show a notification every time a push is sent.
                // At the time of writing this value is required and must be true.
                userVisibleOnly: true,
                applicationServerKey
            })
        )
        .then(subscription => {
            if (subscription) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            if (!pushSubscription || pushSubscription.endpoint !== subscription.endpoint) {
                updateSubscriptionOnServer(subscription, pushSubscription);
            }
            pushSubscription = subscription;
        })
        .catch(error => {
            console.error('User is NOT subscribed because of', error);
            pushSubscription = undefined;
            updateSubscriptionOnServer(undefined, pushSubscription);
            throw error; // rethrow the same rejected error
        });
}

/**
 * @return {Promise<Boolean>}
 */
export function removeSubscription() {
    // NOTE: this assumes hasPermission() has been called
    if (!pushSubscription) return Promise.resolve(true);

    return pushSubscription.unsubscribe().then(result => {
        updateSubscriptionOnServer(undefined, pushSubscription);
        pushSubscription = undefined;
        return result;
    });
}

/**
 * Attach/set-clear the global single handle subscription handler
 * @param {(subscription: PushSubscription|undefined, oldSubscription: PushSubscription|undefined) => void} handle
 */
export function setHandleSubscription(handle) {
    handleSubscription = handle;
}
