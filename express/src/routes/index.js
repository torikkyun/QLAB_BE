import express from 'express';
import authRoute from './auth.route.js';
import rolesRoute from './roles.route.js';
import usersRoute from './users.route.js';
import projectsRoute from './projects.route.js';
import devicesRoute from './devices.route.js';
import loansRoute from './loans.route.js';

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
    route: projectsRoute,
  },
  {
    path: '/devices',
    route: devicesRoute,
  },
  {
    path: '/loans',
    route: loansRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
