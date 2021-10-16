/* eslint-disable no-console */

import { register } from 'register-service-worker';

import {init} from './configurePushNotifications';

if (/* process.env.NODE_ENV === 'production' */ true) {
    register(`${process.env.BASE_URL}service-worker.js`, {
        // registrationOptions: {
        //     scope: `${process.env.BASE_URL}`
        // },
        /**
         * @param {ServiceWorkerRegistration} swRegistration 
         */
        ready(swRegistration) {
            console.log('Service worker is ready.');

            init(swRegistration);
        },
        /**
         * @param {ServiceWorkerRegistration} swRegistration 
         */
        registered(swRegistration) {
            console.log('Service worker has been registered.', swRegistration);
        },
        /**
         * @param {ServiceWorkerRegistration} swRegistration 
         */
        updated(swRegistration) {
            console.log('New content is available, please refresh.', swRegistration);
        },
        cached() {
            console.log('Content has been cached for offline use.');
        },
        updatefound() {
            console.log('New content is downloading.');
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.');
        },
        error(error) {
            console.error('Error during service worker registration:', error);
        }
    });
}
