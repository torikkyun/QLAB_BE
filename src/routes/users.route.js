import express from 'express';
import { validate } from '../middlewares/validations/validate.js';
import passport from 'passport';
import { usersController } from '../controllers/users.controller.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../middlewares/validations/users.validation.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res, next) => {
  await usersController
    .getAllUsers()
    .then((result) => res.json(result))
    .catch(next);
});

router.get('/statistics', async (req, res, next) => {
  await usersController
    .getUserStatistics()
    .then((result) => res.json(result))
    .catch(next);
});

router.get('/:userId', async (req, res, next) => {
  await usersController
    .getUserById(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

router.post('/', validate(createUserSchema), async (req, res, next) => {
  await usersController
    .createUser(req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.patch('/:userId', validate(updateUserSchema), async (req, res, next) => {
  await usersController
    .updateUser(req.params, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.delete('/:userId', async (req, res, next) => {
  await usersController
    .deleteUser(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

export default router;
