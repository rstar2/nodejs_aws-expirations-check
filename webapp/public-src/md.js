// Vuetify utilizes features of ES2015/2017 that require the need to use polyfills for Internet Explorer 11 and Safari 9/10.
import 'babel-polyfill';

import Vue from 'vue';

// this will load the whole Vuetify
// import Vuetify from 'vuetify';
// import 'vuetify/dist/vuetify.min.css';

// this just the sources that will be tree-shaken by the vuetify-loader Webpack plugin
import Vuetify from 'vuetify/lib';
// import colors from 'vuetify/lib/util/colors';

// custom CSS
import './md.css';

// import a 'confirmation' plugin
import VuetifyConfirm from 'vuetify-confirm';

/**
 * This is the main Vue Vuetify plugin
 */
const vuetify = new Vuetify({
    theme: {
        dark: false,
        themes: {
            light: {
                // the default theme colors
                // primary: '#1976D2',
                // secondary: '#424242',
                // accent: '#82B1FF',
                // error: '#FF5252',
                // info: '#2196F3',
                // success: '#4CAF50',
                // warning: '#FFC107',

                primary: '#3f51b5',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#b71c1c',

                // primary: colors.purple,
                // secondary: colors.grey.darken1,
                // accent: colors.shades.black,
                // error: colors.red.accent3,
            }
        }
        
    },
    icons: {
        iconfont: 'md'
    }
});

Vue.use(Vuetify);

// Usage:
// this.$confirm('Do you really want to exit?', { title: 'Warning!'}).then(res => {});
Vue.use(VuetifyConfirm, { 
    vuetify,
    // buttonTrueText: 'Accept',
    // buttonFalseText: 'Discard',
    // color: 'warning',
    // icon: 'warning',
    // title: 'Warning',
    // width: 350,
    // property: '$confirm'
});

export default vuetify;
