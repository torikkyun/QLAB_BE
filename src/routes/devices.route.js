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

router.get('/', async (req, res) => {
  try {
    const result = await devicesController.getAllDevices();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:deviceId', async (req, res) => {
  try {
    const result = await devicesController.getDeviceById(req.params);
    if (!result) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', validate(createDeviceSchema), async (req, res) => {
  try {
    const result = await devicesController.createDevice(req.body);
    if (result.message) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:deviceId', validate(updateDeviceSchema), async (req, res) => {
  try {
    const result = await devicesController.updateDevice(req.params, req.body);
    if (result.message) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:deviceId', async (req, res) => {
  try {
    const result = await devicesController.deleteDevice(req.params);
    if (result.message && result.message !== 'Device deleted successfully') {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get('/statuses', async (req, res) => {
//   try {
//     const result = await deviceStatusesController.getAllDeviceStatuses();
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get('/statuses/:statusId', async (req, res) => {
//   try {
//     const result = await deviceStatusesController.getDeviceStatusById(
//       req.params,
//     );
//     if (!result) {
//       return res.status(404).json({ message: 'Device status not found' });
//     }
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post('/statuses', async (req, res) => {
//   try {
//     const result = await deviceStatusesController.createDeviceStatus(req.body);
//     if (result.message) {
//       return res.status(400).json(result);
//     }
//     res.status(201).json(result);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.patch('/statuses/:statusId', async (req, res) => {
//   try {
//     const result = await deviceStatusesController.updateDeviceStatus(
//       req.params,
//       req.body,
//     );
//     if (result.message) {
//       return res.status(400).json(result);
//     }
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.delete('/statuses/:statusId', async (req, res) => {
//   try {
//     const result = await deviceStatusesController.deleteDeviceStatus(
//       req.params,
//     );
//     if (
//       result.message &&
//       result.message !== 'Device status deleted successfully'
//     ) {
//       return res.status(400).json(result);
//     }
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

export default router;
