import Vue from 'vue';
import Router from 'vue-router';

import RouterComponent from './components/RouterComponent.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "start", webpackPrefetch: true */ './views/main/Start.vue'),
      children: [
        {
          path: '404',
          component: () => import(/* webpackChunkName: "not-found", webpackPrefetch: true */ './views/404.vue'),
        },
        {
          path: 'main',
          component: () => import(/* webpackChunkName: "main", webpackPrefetch: true */ './views/main/Main.vue'),
          children: [
            {
              path: 'dashboard',
              component: () => import(/* webpackChunkName: "main-dashboard", webpackPrefetch: true */ './views/main/Dashboard.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/*', redirect: '/404',
    },
  ],
});
