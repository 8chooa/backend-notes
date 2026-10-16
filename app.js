const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const Note = require('./models/note');
const notesRouter = require('./controllers/notes');

const usersRouter = require('./controllers/users');

const loginRouter = require('./controllers/login');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  })

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger); //al ser llamado y finalizado este metodo pasa al enrutador, si la url coincide con alguno responde, sino el mismo enrutador se encarga de pasar el flujo al siguiente middleware en la cadena  (unknowEndpoint)

app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknowEndpoint);
app.use(middleware.errorHandler);
module.exports = app