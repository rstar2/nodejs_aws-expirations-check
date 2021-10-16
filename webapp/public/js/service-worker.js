/* eslint-disable no-console */
/**
 * @type {ServiceWorker} self
 */

self.addEventListener('fetch', function(event) {
    // console.log(event.request.url);
    event.respondWith(fetch(event.request));
});

// Push notifications
// Again some part is in 'registerServiceWorker.js' file. Also finally the browser's
// Notifications API is used so proper permissions have to be requested and granted
// Like in https://www.blog.plint-sites.nl/how-to-add-push-notifications-to-a-progressive-web-app/


self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('[Service Worker] Subscription expired');
    event.waitUntil(
        self.registration.pushManager.subscribe({ userVisibleOnly: true })
            .then(function(subscription) {
                console.log('[Service Worker] Subscribed after expiration', subscription.endpoint);
                return fetch('register', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint
                    })
                });
            })
    );
});

// Listen to Push events
self.addEventListener('push', event => {
    const body = event.data.text();
    console.log(`[Service Worker] PushMessage received: "${body}"`);

    // There are multiple options tat can be used
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    // https://tests.peter.sh/notification-generator/
    const title = 'Expirations Report';
    const options = {
        body,
        // icon: 'images/icon.png',
        // image: 'images/image.png',
        // badge: 'images/badge.png',
        vibrate: [300, 200, 300],

        // actions: [
        //     { action: 'explore', title: 'Explore this new world', icon: 'images/checkmark.png' },
        //     { action: 'close', title: 'Close notification', icon: 'images/xmark.png' }
        // ],

        // arbitrary data, can be any type
        // data: {
        //     xxx: 111,
        //     yyy: 222
        // }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Listen to events interacting with a notification
// self.addEventListener('notificationclose', event => {
//     const notification = event.notification;
//     const xxx = notification.data.xxx;
//     console.log('[Service Worker] Notification closed' + xxx);
// });
// self.addEventListener('notificationclick', event => {
//     console.log('[Service Worker] Notification click Received.');

//     // close notification if desired
//     event.notification.close();

//     // if it has actions we can see which one has been clicked
//     const action = event.action;
//     if (action === 'close') {
//     //notification.close();
//     } else {
//     // open a new window
//         event.waitUntil(clients.openWindow('https://developers.google.com/web/'));
//     }
// });

// for Firebase Cloud Messaging it is a little different
// https://firebase.google.com/docs/cloud-messaging/js/client?authuser=0
