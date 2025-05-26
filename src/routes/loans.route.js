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

router.get('/', async (req, res, next) => {
  await loansController
    .getAllLoans()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/statistics', async (req, res, next) => {
  await loansController
    .getLoanStatistics()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:userId', async (req, res, next) => {
  await loansController
    .getLoansByUserId(req.params)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post(
  '/borrow',
  validate(borrowDevicesSchema),
  async (req, res, next) => {
    await loansController
      .borrowDevices(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  },
);

router.post(
  '/return',
  validate(returnDevicesSchema),
  async (req, res, next) => {
    await loansController
      .returnDevices(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  },
);

export default router;
