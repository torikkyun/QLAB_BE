import express from 'express';
import { rolesController } from '../controllers/roles.controller.js';
import { validateRole } from '../middlewares/validations/roles.validation.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: roles
 */

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags: [roles]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 */
router.get('/', async (req, res) => {
  const result = await rolesController.getAllRole();
  res.json(result);
});

/**
 * @openapi
 * /api/roles:
 *   post:
 *     tags: [roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 */
router.post('/', validateRole, async (req, res) => {
  try {
    const result = await rolesController.createRole(req.body);
    res.json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/roles/{id}:
 *   patch:
 *     tags: [roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 */
router.patch('/:id', async (req, res) => {
  const result = await rolesController.updateRole(req.params, req.body);
  res.json(result);
});

/**
 * @openapi
 * /api/roles/{id}:
 *   delete:
 *     tags: [roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa role thành công
 */
router.delete('/:id', async (req, res) => {
  await rolesController.deleteRole(req.params);
  res.sendStatus(204);
});

export default router;
