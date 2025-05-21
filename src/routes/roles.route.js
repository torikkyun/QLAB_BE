import express from 'express';
import { rolesController } from '../controllers/roles.controller.js';
import {
  createRoleSchema,
  updateRoleSchema,
} from '../middlewares/validations/roles.validation.js';
import { validate } from '../middlewares/validations/validate.js';
import passport from 'passport';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res, next) => {
  await rolesController
    .getAllRoles()
    .then((result) => res.json(result))
    .catch(next);
});

router.post('/', validate(createRoleSchema), async (req, res, next) => {
  await rolesController
    .createRole(req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.patch('/:roleId', validate(updateRoleSchema), async (req, res, next) => {
  await rolesController
    .updateRole(req.params, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.delete('/:roleId', async (req, res, next) => {
  await rolesController
    .deleteRole(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

export default router;
