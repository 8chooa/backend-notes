require('dotenv').config() //para tener acceso a las variables establecidas en el .env
const express = require('express')
const cors = require('cors')
const Note = require('./models/note') //nos traemos la clase del modelo para crear objetos

const app = express()

app.use(express.static('dist'))

app.use(cors())

app.use(express.json()) //convierte a objeto JS un JSON en el cuerpo de solicitud de un POST enviado por el cliente, además el objeto lo pasa a la propiedad request.body

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if(note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id'})
    })
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    note.save().then(savedNote => { 
        response.json(savedNote) //los datos enviados al clientes son los formateados
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        console.log(result)
        response.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, context: 'query', runValidators: true })
    .then(updatedNote => {
        response.json(updatedNote)
    }).catch(error => next(error))
})

const unknowEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknowEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if(error.name == 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
//pone a la aplicación a escuchar en el puerto indicado
app.listen(PORT, () => { //la funcion callback se ejecuta solo cuando el servidor se ha encendido con éxito
    console.log('Server running on port ', PORT)
})