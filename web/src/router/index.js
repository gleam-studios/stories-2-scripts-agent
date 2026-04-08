import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/projects' },
  { path: '/settings', component: () => import('../views/Settings.vue') },
  { path: '/projects', component: () => import('../views/Projects.vue') },
  { path: '/workbench/:slug', component: () => import('../views/Workbench.vue'), props: true },
  { path: '/export/:slug', component: () => import('../views/Export.vue'), props: true },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
