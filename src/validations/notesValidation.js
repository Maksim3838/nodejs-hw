import { Joi, Segments } from 'celebrate';

export const createStudentSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
      "string.base": "Name must be a string",
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should have at most {#limit} characters",
      "any.required": "Name is required",
    }),
    age: Joi.number().integer().min(12).max(65).required().messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least {#limit}",
      "number.max": "Age must be at most {#limit}",
      "any.required": "Age is required",
    }),
    gender: Joi.string().valid("male", "female", "other").required().messages({
      "any.only": "Gender must be one of: male, female, or other",
      "any.required": "Gender is required",
    }),
    avgMark: Joi.number().min(2).max(12).required().messages({
      "number.base": "Average mark must be a number",
      "number.min": "Average mark must be at least {#limit}",
      "number.max": "Average mark must be at most {#limit}",
      "any.required": "Average mark is required",
    }),
    onDuty: Joi.boolean().messages({
      "boolean.base": "onDuty must be a boolean value",
    }),
  }),
  
};
