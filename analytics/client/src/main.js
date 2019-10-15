import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount("#app");

// eslint-disable-next-line no-console
console.log(process.env.VUE_APP_API_URL);
