const users = require('../data/MOCK_DATA.json');
const ApiError = require('../utils/ApiError');

/**
 * ============================================================
 *  user.service.js
 * ------------------------------------------------------------
 *  All business logic for the "user" resource lives here.
 *  Services never touch req/res - they take plain values in,
 *  return plain values out (or throw an ApiError).
 * ============================================================
 */

const getAllUsers = ({ page, limit } = {}) => {
  if (!page || !limit) return users;

  const start = (page - 1) * limit;
  const end = start + limit;
  return users.slice(start, end);
};

const getUserById = (id) => {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw ApiError.notFound(`User with id ${id} not found`);
  }
  return user;
};

const createUser = (data) => {
  const maxId = users.reduce((max, u) => Math.max(max, u.id || 0), 0);
  const newUser = {
    id: maxId + 1,
    name: data.name,
    email: data.email,
    role: data.role,
    gender: data.gender,
  };
  users.push(newUser);
  return newUser;
};

const updateUser = (id, data) => {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw ApiError.notFound(`User with id ${id} not found`);
  }
  Object.assign(user, data);
  return user;
};

const deleteUser = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw ApiError.notFound(`User with id ${id} not found`);
  }
  const [removed] = users.splice(index, 1);
  return removed;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
