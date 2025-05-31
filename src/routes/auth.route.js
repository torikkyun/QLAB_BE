import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validations/validate.js';
import {
  loginSchema,
  registerSchema,
} from '../middlewares/validations/auth.validation.js';

const router = express.Router();

router.post('/login', validate(loginSchema), async (req, res, next) => {
  await authController
    .login(req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  await authController
    .register(req.body)
    .then((result) => res.json(result))
    .then(next);
});

export default router;
