import express from 'express';
import authRoute from './auth.route.js';
import rolesRoute from './roles.route.js';
import usersRoute from './users.route.js';
import projectRoute from './projects.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/roles',
    route: rolesRoute,
  },
  {
    path: '/users',
    route: usersRoute,
  },
  {
    path: '/projects',
    route: projectRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
