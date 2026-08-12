const express = require('express');
const userController = require('../controllers/user.controller');
const { validate, schemas } = require('../validations/schemaValidation');

/**
 * ============================================================
 *  user.routes.js
 * ------------------------------------------------------------
 *  Maps URLs -> [validation middleware] -> controller.
 *  Validation always runs BEFORE the controller; if it fails,
 *  the request never reaches the controller/service.
 * ============================================================
 */

const router = express.Router();

router.get(
  '/',
  validate(schemas.listUsersQuerySchema, 'query'),
  userController.listUsers
);

router.get(
  '/:id',
  validate(schemas.userIdParamSchema, 'params'),
  userController.getUser
);

router.post(
  '/',
  validate(schemas.createUserSchema, 'body'),
  userController.createUser
);

router.put(
  '/:id',
  validate(schemas.userIdParamSchema, 'params'),
  validate(schemas.updateUserSchema, 'body'),
  userController.updateUser
);

router.delete(
  '/:id',
  validate(schemas.userIdParamSchema, 'params'),
  userController.deleteUser
);

module.exports = router;
