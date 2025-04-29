import Joi from 'joi';

export const createDeviceSchema = Joi.object({
  name: Joi.string().max(50).trim().required(),
  code: Joi.string().max(50).trim().required(),
  cost: Joi.number().integer().min(0).required(),
  description: Joi.string().max(255).allow(null, ''),
  statusId: Joi.number().integer().required(),
});

export const updateDeviceSchema = Joi.object({
  name: Joi.string().max(50).trim(),
  code: Joi.string().max(50).trim(),
  cost: Joi.number().integer().min(0),
  description: Joi.string().max(255).allow(null, ''),
  statusId: Joi.number().integer(),
}).min(1);

export const createDeviceStatusSchema = Joi.object({
  name: Joi.string().max(50).trim().required(),
  description: Joi.string().max(255).allow(null, ''),
});

export const updateDeviceStatusSchema = Joi.object({
  name: Joi.string().max(50).trim(),
  description: Joi.string().max(255).allow(null, ''),
}).min(1);
