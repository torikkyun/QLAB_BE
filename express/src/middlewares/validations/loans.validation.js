import Joi from 'joi';

export const borrowDevicesSchema = Joi.object({
  userId: Joi.number().integer().required(),
  devices: Joi.array()
    .items(
      Joi.object({
        deviceId: Joi.number().integer().required(),
        description: Joi.string().max(255),
      }),
    )
    .min(1)
    .required(),
});

export const returnDevicesSchema = Joi.object({
  userId: Joi.number().integer().required(),
  devices: Joi.array().items(Joi.number().integer()).min(1).required(),
});
