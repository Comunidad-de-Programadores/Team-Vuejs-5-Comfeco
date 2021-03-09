import Vue from 'vue';
import VueRouter from 'vue-router';

import { auth } from '../config/firebase';
import Home from '../views/Home';
import Login from '../views/auth/Login';
import SignUp from '../views/auth/SignUp';
import Forgot from '../views/auth/Forgot';
import Terms from '../views/Terms';
import Politics from '../views/Politics';
import Dashboard from '../views/private/Dashboard';
import Edit from '../views/private/profile/Edit';
import Badges from '../views/private/profile/Badges';
import MyProfile from '../views/private/profile/MyProfile';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: Forgot,
  },
  {
    path: '/terminos-y-condiciones',
    name: 'Terms',
    component: Terms,
  },
  {
    path: '/politicas-de-privacidad',
    name: 'Politics',
    component: Politics,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: MyProfile,
      },
      {
        path: 'insignias',
        component: Badges,
      },
    ],
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requirestAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requirestAuth && !currentUser) {
    next('login');
  } else if (!requirestAuth && currentUser) {
    next('dashboard');
  } else {
    next();
  }
});

export default router;
