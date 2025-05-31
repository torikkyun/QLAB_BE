import express from 'express';
import { devicesController } from '../controllers/devices.controller.js';
import passport from 'passport';
import { validate } from '../middlewares/validations/validate.js';
import {
  createDeviceSchema,
  updateDeviceSchema,
} from '../middlewares/validations/devices.validation.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res, next) => {
  await devicesController
    .getAllDevices()
    .then((result) => res.json(result))
    .catch(next);
});

// TODO: chuyển sang route khác
router.get('/statistics', async (req, res, next) => {
  await devicesController
    .getDeviceStatistics()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:deviceId', async (req, res, next) => {
  await devicesController
    .getDeviceById(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

router.post('/', validate(createDeviceSchema), async (req, res, next) => {
  await devicesController
    .createDevice(req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.patch(
  '/:deviceId',
  validate(updateDeviceSchema),
  async (req, res, next) => {
    await devicesController
      .updateDevice(req.params, req.body)
      .then((result) => res.json(result))
      .catch(next);
  },
);

router.delete('/:deviceId', async (req, res, next) => {
  await devicesController
    .deleteDevice(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

export default router;
