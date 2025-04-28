import express from 'express';
import { rolesController } from '../controllers/roles.controller.js';
import { createRoleSchema } from '../middlewares/validations/roles.validation.js';
import { validate } from '../middlewares/validations/validate.js';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));
router.use(authorizeRoles(1));

router.get('/', async (req, res) => {
  const result = await rolesController.getAllRole();
  res.json(result);
});

router.post('/', validate(createRoleSchema), async (req, res) => {
  try {
    const result = await rolesController.createRole(req.body);
    res.json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.patch('/:roleId', async (req, res) => {
  const result = await rolesController.updateRole(req.params, req.body);
  res.json(result);
});

router.delete('/:roleId', async (req, res) => {
  await rolesController.deleteRole(req.params);
  res.sendStatus(204);
});

export default router;
