const notesRouter = require('express').Router(); // instancia aislada que permite la modularizacion (separar los enrutadores y los middleware de app.js)
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getFromToken = (request) => {
  const authorization = request.get('authorization'); //obtenemos el encabezado de autorization (el valor)
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post('/', async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(getFromToken(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  console.log(user)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id,
  });

  const savedNote = await note.save();
  console.log(savedNote)
  user.notes = user.notes.concat(savedNote.id);
  await user.save();

  response.status(201).json(savedNote);
});

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

notesRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { returnDocument: 'after' });
  response.json(updatedNote);
})

module.exports = notesRouter;