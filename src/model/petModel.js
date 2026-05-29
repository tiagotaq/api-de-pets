const bcrypt = require('bcryptjs');

//Abaixo consta uma massa de dados fixa para o teste automatizado como fizemos na aula
const pets = [
    {
        id: 1,
        userId: 1,
        name: "Luke",
        type: "Cão"
    },
    {
        id: 2,
        userId: 1,
        name: "Maurício",
        type: "Jabuti"
    },
    {
        id: 3,
        userId: 2,
        name: "Pandora",
        type: "Gato"
    },
];

module.exports = {
    pets,
};