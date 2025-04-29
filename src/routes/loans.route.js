import express from 'express';
import passport from 'passport';
import { validate } from '../middlewares/validations/validate.js';
import { loansController } from '../controllers/loans.controller.js';
import {
  borrowDevicesSchema,
  returnDevicesSchema,
} from '../middlewares/validations/loans.validation.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res) => {
  const result = await loansController.getAllLoans();
  res.json(result);
});

router.get('/:userId', async (req, res) => {
  const result = await loansController.getLoansByUserId(req.params);
  res.json(result);
});

router.post('/borrow', validate(borrowDevicesSchema), async (req, res) => {
  const result = await loansController.borrowDevices(req.body);
  res.json(result);
});

router.post('/return', validate(returnDevicesSchema), async (req, res) => {
  const result = await loansController.returnDevices(req.body);
  res.json(result);
});

export default router;
