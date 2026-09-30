import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import TablaProductos from '../components/TablaProductos.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/productos', 
    component: TablaProductos, 
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de Navegación para validar autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;