import Vue from 'vue';

import vuetify from './md';
import App from './App';

import './registerServiceWorker';

new Vue({
    vuetify,
    render: h => h(App),
}).$mount('#app');
