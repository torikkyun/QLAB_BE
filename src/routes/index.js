import express from 'express';
import authRoute from './auth.route.js';
import usersRoute from './users.route.js';
import rolesRoute from './roles.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: usersRoute,
  },
  {
    path: '/roles',
    route: rolesRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
