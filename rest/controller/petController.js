const petService = require('../../src/service/petService');

function addPet(req, res) {
  const userId = req.user.id;
  const { name, type } = req.body;
  if (!name || !type) return res.status(400).json({ error: 'Name and type required' });
  const pet = petService.addPet(userId, name, type);
  if (!pet) return res.status(409).json({ error: 'Pet with this name already exists for this user' });
  res.status(201).json(pet);
}

function getPets(req, res) {
  res.json(petService.getAllPets());
}

function getUserPets(req, res) {
  const userId = req.user.id;
  const { name, type } = req.query;
  res.json(petService.getPetsByUser(userId, { name, type }));
}

function deletePet(req, res) {
  const userId = req.user.id;
  const petId = parseInt(req.params.id);
  if (!petId) return res.status(400).json({ error: 'Pet id required' });
  const success = petService.deletePet(userId, petId);
  if (!success) return res.status(404).json({ error: 'Pet not found or not owned by user' });
  res.status(204).send();
}

module.exports = {
  addPet,
  getPets,
  getUserPets,
  deletePet,
};
