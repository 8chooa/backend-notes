const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:', request.path);
  logger.info('Body:', request.body);
  logger.info('---');
  next(); //? -> a donde se pasa? R: al siguiente en la cadena segun sean llamados
}

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknow endpoint'});
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformattd id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message, note: 'este manejador de errores se llamo solo por express -v5.+'});
  } else if (error.name === 'MongoServerError') {
    return response.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }

  next(error);
}

module.exports = {
  requestLogger,
  unknowEndpoint,
  errorHandler,
}