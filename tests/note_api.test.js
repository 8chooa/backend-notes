const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const assert = require('node:assert');
const api = supertest(app); //devuelve un objeto llamado superagent que es internamente un cliente de peticiones HTTP
const bcrypt = require('bcrypt');

const Note = require('../models/note');
const User = require('../models/user');

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({});
    await Note.insertMany(helper.initialNotes);

    //para el usuario de las pruebas
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);

    const user = new User({
      username: 'root',
      passwordHash
    });

    await user.save();
  });

  test('notes are returned as json', async () => {
    console.log('entered test');
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/) //se utiliza RegEx porque si colocamos un string comparará literalmente el tipo de cabecera, y existe la posibilidad que el Content-Type sea application/json; charset=utf-8 y eso no es exactamente igual a 'application/json' al colocar la expresion regular con aseguramos de que incluya 'application/json'
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');
  
    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map(elem => elem.content);

    assert(contents.includes('Browser can execute only JavaScript'));
  });

  describe('viewing a specific note', () => {

    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToView = notesAtStart[0];

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      
      assert.deepStrictEqual(resultNote.body, noteToView);
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400);
    });
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {

      const users = await User.find({});
      const userTest = users[0];
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: userTest._id,
      };

      await api
        .post('/api/notes')
        .send(newNote) //adjunta el cuerpo de la solicitud
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const noteAtEnd = await helper.notesInDb();
      assert.strictEqual(noteAtEnd.length, helper.initialNotes.length + 1);

      const contents = noteAtEnd.map(elem => elem.content);
      assert(contents.includes('async/await simplifies making async calls'));
    });

    test.only('note without content is not added', async () => {
      const users = await User.find({});
      const userTest = users[0];
      
      const newNote = {
        important: true,
        userId: userTest._id,
      }
      
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);
      
      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);

      const contents = notesAtEnd.map(note => note.content);
      assert(!contents.includes(noteToDelete.content));
    })
  })
});

//el uso de async permite que todo valor devuelto sea una promesa y tambien nos permite utilizar await que pausa la ejecucion mientras se espera el resultado de la operacion

//prueba para verificar si una nota sin contenido no se guarda en la db

//after permite ejecutar codigo al finalizar los test (util para cerrar conexiones con db, o cerrar un puerto si es que se levantó explicitamente)
after(async () => {
  await mongoose.connection.close();
  //espera a que termine el cierre de conexion para finalizar con el after (sin await no puede finalizar el after sin esperar a que termine el cierre de conexion con la db)
})

