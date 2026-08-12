const Joi = require('joi');

/**
 * ============================================================
 *  schemaValidation.js
 * ------------------------------------------------------------
 *  Single source of truth for request validation.
 *
 *  - Every API's expected shape (body / params / query) is
 *    defined here as a Joi schema.
 *  - `validate(schema, source)` is a reusable Express middleware
 *    factory: give it a schema, it validates req[source] and
 *    either calls next() or responds with a 400 + error details.
 *
 *  Add a new API?
 *    1. Define its schema below.
 *    2. Import it in the relevant route file.
 *    3. Attach it with `validate(schema, 'body' | 'params' | 'query')`.
 * ============================================================
 */

// ---------- Reusable field-level rules ----------
const idParam = Joi.number().integer().positive().required().messages({
  'number.base': 'id must be a number',
  'number.integer': 'id must be an integer',
  'number.positive': 'id must be a positive number',
  'any.required': 'id is required',
});

// ---------- User schemas ----------

// POST /api/users -> body
const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'name is required',
    'string.min': 'name must be at least 2 characters',
    'any.required': 'name is required',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.email': 'email must be a valid email address',
    'string.empty': 'email is required',
    'any.required': 'email is required',
  }),
  role: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'role is required',
    'any.required': 'role is required',
  }),
  gender: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'gender is required',
    'any.required': 'gender is required',
  }),
});

// PUT /api/users/:id -> body (all optional, but at least one field required)
const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'name must be at least 2 characters',
  }),
  email: Joi.string().trim().email().messages({
    'string.email': 'email must be a valid email address',
  }),
  role: Joi.string().trim().min(2).max(100),
  gender: Joi.string().trim().min(2).max(50),
})
  .min(1)
  .messages({
    'object.min': 'At least one field (name, email, role, gender) must be provided to update',
  });

// GET /api/users/:id, PUT /api/users/:id, DELETE /api/users/:id -> params
const userIdParamSchema = Joi.object({
  id: idParam,
});

// GET /api/users -> query (pagination is optional)
const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

// ---------- Validation middleware factory ----------
/**
 * @param {Joi.Schema} schema  - schema defined above
 * @param {'body'|'params'|'query'} source - which part of req to validate
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false, // collect all errors, not just the first
    stripUnknown: true, // drop fields not defined in the schema
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message.replace(/"/g, ''));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // replace with the validated/sanitized value
  req[source] = value;
  return next();
};

module.exports = {
  validate,
  schemas: {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    listUsersQuerySchema,
  },
};
