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

router.get('/', async (req, res, next) => {
  await projectsController
    .getAllProjects()
    .then((result) => res.json(result))
    .catch(next);
});

router.get('/:projectId', async (req, res, next) => {
  await projectsController
    .getProjectById(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

router.post('/', validate(createProjectSchema), async (req, res, next) => {
  await projectsController
    .createProject(req.body)
    .then((result) => res.json(result))
    .catch(next);
});

router.patch(
  '/:projectId',
  validate(updateProjectSchema),
  async (req, res, next) => {
    await projectsController
      .updateProject(req.params, req.body)
      .then((result) => res.json(result))
      .catch(next);
  },
);

router.delete('/:projectId', async (req, res, next) => {
  await projectsController
    .deleteProject(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

router.get('/:projectId/members', async (req, res, next) => {
  await projectMembersController
    .getProjectMembers(req.params)
    .then((result) => res.json(result))
    .catch(next);
});

router.post(
  '/:projectId/members',
  validate(addMultipleProjectMembersSchema),
  async (req, res, next) => {
    await projectMembersController
      .addMultipleProjectMembers(req.params, req.body)
      .then((result) => res.json(result))
      .catch(next);
  },
);

router.patch(
  '/:projectId/:userId',
  validate(updateProjectMemberSchema),
  async (req, res, next) => {
    await projectMembersController
      .updateProjectMember(req.params, req.body)
      .then((result) => res.json(result))
      .catch(next);
  },
);

export default router;
