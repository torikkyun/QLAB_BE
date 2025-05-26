import express from 'express';
import passport from 'passport';
import { statisticsController } from '../controllers/statistics.controller.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res, next) => {
  await statisticsController
    .getStatistics()
    .then((result) => res.json(result))
    .catch(next);
});

export default router;
