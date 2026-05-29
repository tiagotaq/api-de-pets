const userService = require('../../src/service/userService');
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = userService.registerUser(username, password);
  if (!user) return res.status(409).json({ error: 'User already exists' });
  res.status(201).json({ id: user.id, username: user.username });
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = userService.validateUser(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
}

function getUsers(req, res) {
  res.json(userService.getAllUsers());
}

module.exports = {
  register,
  login,
  getUsers,
  SECRET,
};