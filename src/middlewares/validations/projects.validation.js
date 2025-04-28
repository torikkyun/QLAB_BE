import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().max(100).trim().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  description: Joi.string().max(255),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().max(100).trim(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  description: Joi.string().max(255),
});
