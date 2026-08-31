const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://luisfexd14_db_user:${password}@cluster0.wsncqlm.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery', false) //Establece consultas no estrictas (si hacemos una consulta a un campo no definido en el schema lo busca, (por defecto no))

mongoose.connect(url)

const noteSchema = new mongoose.Schema({ //creamos una especie de 'plantilla' para nuestra coleccion
    content: String,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema) //me dará una clase para construir objeto y la interfaz con MongoDB, es decir posee todos los métodos para interactuar con la coleccion notes

const note = new Note({ //creamos el objeto a partir de la clase
    content: 'Mongoose is weird',
    important: true
})

/*
note.save().then(result => {
    console.log('note saved at DB')
    mongoose.connection.close()
})
*/

Note.find({}).then(result => {
    result.forEach(data => {
        console.log(data)
    })
    mongoose.connection.close()
})

