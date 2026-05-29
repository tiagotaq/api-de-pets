
const { pets } = require('../model/petModel');

function addPet(userId, name, type) {
  if (pets.find(p => p.userId === userId && p.name === name)) return null;
  const pet = { id: pets.length + 1, userId, name, type };
  pets.push(pet);
  return pet;
}

function getPetsByUser(userId, filters = {}) {
  const { name, type } = filters;

  return pets.filter(p => {
    const isUserPet = p.userId === userId;
    const matchesName = name ? p.name === name : true;
    const matchesType = type ? p.type === type : true;

    return isUserPet && matchesName && matchesType;
  });
}

function getAllPets() {
  return pets;
}

function deletePet(userId, petId) {
  const index = pets.findIndex(p => p.id === petId && p.userId === userId);
  if (index === -1) return false;
  pets.splice(index, 1);
  return true;
}

module.exports = {
  addPet,
  getPetsByUser,
  getAllPets,
  deletePet,
};
