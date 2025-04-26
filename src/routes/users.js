import express from 'express';
import { getAllUser } from '../controllers/users.js';

const router = express.Router();

router.get('/', (req, res) => {
  const users = getAllUser();
  res.json(users);
});

export default router;
