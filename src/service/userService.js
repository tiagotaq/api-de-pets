const { users } = require('../model/userModel');
const bcrypt = require('bcryptjs');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function registerUser(username, password) {
  if (findUserByUsername(username)) return null;
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, username, password: hash };
  users.push(user);
  return user;
}

function validateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password)) return null;
  return user;
}

function getAllUsers() {
  return users.map(u => ({ id: u.id, username: u.username }));
}

module.exports = {
  registerUser,
  validateUser,
  getAllUsers,
  findUserByUsername,
};