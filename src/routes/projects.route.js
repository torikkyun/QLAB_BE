import express from 'express';
import passport from 'passport';
import { validate } from '../middlewares/validations/validate.js';
import { projectsController } from '../controllers/projects.controller.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../middlewares/validations/projects.validation.js';
import { projectMembersController } from '../controllers/project-members.controller.js';
import {
  addMultipleProjectMembersSchema,
  updateProjectMemberSchema,
} from '../middlewares/validations/project-members.validation.js';

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res) => {
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

router.patch('/:projectId', validate(updateProjectSchema), async (req, res) => {
  const result = await projectsController.updateProject(req.params, req.body);
  res.json(result);
});

router.delete('/:projectId', async (req, res) => {
  const result = await projectsController.deleteProject(req.params);
  res.json(result);
});

router.get('/:projectId/members', async (req, res, next) => {
  projectMembersController
    .getProjectMembers(req.params)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post(
  '/:projectId/members',
  validate(addMultipleProjectMembersSchema),
  (req, res, next) => {
    projectMembersController
      .addMultipleProjectMembers(req.params, req.body)
      .then((result) => res.json(result))
      .catch(next);
  },
);

router.patch(
  '/:projectId/:userId',
  validate(updateProjectMemberSchema),
  (req, res, next) => {
    projectMembersController
      .updateProjectMember(req.params, req.body)
      .then((result) => res.json(result))
      .catch(next);
  },
);

export default router;
