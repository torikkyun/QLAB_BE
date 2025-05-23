import Joi from 'joi';

export const createRoleSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).optional(),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).optional(),
});
