import express from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const result = await authController.login(req.body);
  res.json(result);
});

router.post('/register', async (req, res) => {
  const result = await authController.register(req.body);
  res.json(result);
});

export default router;
