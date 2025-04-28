import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().max(100).trim().required(),
  lastName: Joi.string().max(100).trim().required(),
  email: Joi.string().email().max(50).required(),
  phone: Joi.string().max(20).required(),
  password: Joi.string().min(6).max(255).required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().max(100).trim().required(),
  lastName: Joi.string().max(100).trim().required(),
  email: Joi.string().email().max(50).required(),
  phone: Joi.string().max(20).required(),
});
