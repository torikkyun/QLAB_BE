import express from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validate } from '../middlewares/validations/validate.js';
import { projectsController } from '../controllers/projects.controller.js';
import { createProjectSchema } from '../middlewares/validations/projects.validation.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', authorizeRoles('Admin'), async (req, res) => {
  const result = await projectsController.getAllProjects();
  res.json(result);
});

router.get('/:projectId', async (req, res) => {
  const result = await projectsController.getProjectById(req.params);
  res.json(result);
});

router.post('/', validate(createProjectSchema), async (req, res) => {
  const result = await projectsController.createProject(req.body);
  res.json(result);
});

router.patch('/:projectId', validate(createProjectSchema), async (req, res) => {
  const result = await projectsController.updateProject(req.params, req.body);
  res.json(result);
});

router.delete('/:projectId', authorizeRoles('Admin'), async (req, res) => {
  const result = await projectsController.deleteProject(req.params);
  res.json(result);
});

export default router;
