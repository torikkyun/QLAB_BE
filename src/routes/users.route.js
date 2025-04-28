import express from 'express';
import { validate } from '../middlewares/validations/validate.js';
import passport from 'passport';
import { usersController } from '../controllers/users.controller.js';
import { updateUserSchema } from '../middlewares/validations/users.validation.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res) => {
  const result = await usersController.getAllUsers();
  res.json(result);
});

router.get('/:userId', async (req, res) => {
  const result = await usersController.getUserById(req.params);
  res.json(result);
});

router.patch('/:userId', validate(updateUserSchema), async (req, res) => {
  const result = await usersController.updateUser(req.params, req.body);
  res.json(result);
});

router.delete('/:userId', async (req, res) => {
  const result = await usersController.deleteUser(req.params);
  res.json(result);
});

export default router;
