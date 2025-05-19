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

router.get('/', async (req, res) => {
  const result = await rolesController.getAllRoles();
  res.json(result);
});

router.post('/', validate(createRoleSchema), async (req, res) => {
  const result = await rolesController.createRole(req.body);
  res.json(result);
});

router.patch('/:roleId', validate(updateRoleSchema), async (req, res) => {
  const result = await rolesController.updateRole(req.params, req.body);
  res.json(result);
});

router.delete('/:roleId', async (req, res) => {
  const result = await rolesController.deleteRole(req.params);
  res.json(result);
});

export default router;
