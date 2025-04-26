import Joi from 'joi';

const roleSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).optional(),
});

export const validateRole = (req, res, next) => {
  const { error } = roleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details,
    });
  }
  next();
};
