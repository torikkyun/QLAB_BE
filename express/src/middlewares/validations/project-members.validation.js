import Joi from 'joi';

export const addProjectMemberSchema = Joi.object({
  userId: Joi.number().integer().required(),
  projectId: Joi.number().integer().required(),
  isManager: Joi.boolean().default(false),
});

export const addMultipleProjectMembersSchema = Joi.object({
  members: Joi.array()
    .items(
      Joi.object({
        userId: Joi.number().integer().required(),
        isManager: Joi.boolean().default(false),
      }),
    )
    .min(1)
    .required(),
});

export const updateProjectMemberSchema = Joi.object({
  isManager: Joi.boolean().required(),
});
