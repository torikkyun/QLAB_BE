import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validations/validate.js';
import {
  loginSchema,
  registerSchema,
} from '../middlewares/validations/auth.validation.js';

const router = express.Router();

router.post('/login', validate(loginSchema), async (req, res) => {
  const result = await authController.login(req.body);
  res.json(result);
});

router.post('/register', validate(registerSchema), async (req, res) => {
  const result = await authController.register(req.body);
  res.json(result);
});

export default router;
