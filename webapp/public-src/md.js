// Vuetify utilizes features of ES2015/2017 that require the need to use polyfills for Internet Explorer 11 and Safari 9/10.
import 'babel-polyfill';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// custom CSS
import './md.css';

/**
 * This is the main Vue Vuetify plugin
 */
export default {
    install(Vue) {
        Vue.use(Vuetify);
    },
};
