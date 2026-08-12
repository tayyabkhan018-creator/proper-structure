const userService = require('../services/user.service');

/**
 * ============================================================
 *  user.controller.js
 * ------------------------------------------------------------
 *  Thin layer: read the (already validated) request, call the
 *  matching service, shape the HTTP response. Any thrown error
 *  is passed to next(err) so the central error handler deals
 *  with it - no try/catch duplication in every function.
 * ============================================================
 */

const listUsers = (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = userService.getAllUsers({ page, limit });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

const getUser = (req, res, next) => {
  try {
    const user = userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = (req, res, next) => {
  try {
    const newUser = userService.createUser(req.body);
    return res.status(201).json(newUser);
  } catch (err) {
    return next(err);
  }
};

const updateUser = (req, res, next) => {
  try {
    const updated = userService.updateUser(req.params.id, req.body);
    return res.status(200).json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    return next(err);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const removed = userService.deleteUser(req.params.id);
    return res.status(200).json({ message: 'User deleted', user: removed });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
