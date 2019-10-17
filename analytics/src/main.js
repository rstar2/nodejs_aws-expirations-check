import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount("#app");

// eslint-disable-next-line no-console
console.log(process.env.VUE_APP_API_URL + '    ' + process.env.VUE_APP_GOOGLE_ANALYTICS_VIEW_ID);
// fetch(process.env.VUE_APP_API_URL)
//     .then(res => res.json())
//     .then(data => data.data)
//     // eslint-disable-next-line no-console
//     .then(console.log);
