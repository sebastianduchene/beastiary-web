import store from '@/store';
import '@babel/polyfill';
import Vue from 'vue';
import VueWorker from 'vue-worker';
import App from './App.vue';
// Import Component hooks before component definitions
import './component-hooks';
import './plugins/vee-validate';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.config.productionTip = false;
Vue.config.errorHandler = (err, vm, info) => {
  console.error('[Vue error]', err, info);
  document.body.innerHTML = `<pre style="color:red;padding:20px">${err}\n\n${info}</pre>`;
};

Vue.use(VueWorker);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
