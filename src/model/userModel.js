const bcrypt = require('bcryptjs');

//Abaixo consta uma massa de dados fixa para o teste automatizado como fizemos na aula
const users = [
    {
        id: 1,
        username: "tiago",
        password: bcrypt.hashSync('123456', 8)
    },
    {
        id: 2,
        username: "ricardo",
        password: bcrypt.hashSync('456789', 8)
    }
];

module.exports = {
    users,
};