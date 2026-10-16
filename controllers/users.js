const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const { nonExistingId } = require('../tests/test_helper');

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;

  const saltRounds = 10; //cadena necesaria para la funcion hash
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 }); // ?? cual es el argumento real de populate la coleccion? el nombre en plural de la coleccion y en minusculas
  response.json(users);
});

module.exports = usersRouter;