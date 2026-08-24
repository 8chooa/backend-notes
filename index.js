const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json()) //convierte a objeto JS un JSON en el cuerpo de solicitud de un POST enviado por el cliente, además el objeto lo pasa a la propiedad request.body

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    },
    {
        id: 4,
        content: "EXPRESS JS is funny",
        important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes/', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(n => n.id === id)
    if(note) {
        response.json(note)
    } else {
        response.statusMessage = 'Nota no encontrada en la DB!'
        response.status(404).end()
    }
})

const generateId = () => { //NOTA: ESTE METODO DE GENERACION DE ID NO SE RECOMIENDA
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    console.log(maxId)
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.content) {
        return response.status(400).json({error: 'content missing'})
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes.concat(note)
    response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
//pone a la aplicación a escuchar en el puerto indicado
app.listen(PORT, () => { //la funcion callback se ejecuta solo cuando el servidor se ha encendido con éxito
    console.log('Server running on port ', PORT)
})