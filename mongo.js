//SCRIPT PARA LA MANIPULACION SIMPLE DE LA DB...
const mongoose = require('mongoose')
const config = require('./utils/config')
/*
if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
*/
//const password = process.argv[2]

const url = config.MONGODB_URI;

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

const note2 = new Note({
    content: 'Hello world mongo.js at test',
    important: false,
})

const guardar = async () => {
    await note.save(); //espera a que termine el primer guardado para seguir
    await note2.save(); //espera a que termine el segundo guardado antes de seguir
    await mongoose.connection.close() //espera a que se cierre la conexion antes de terminal la funcion
} //una se se cierra la conexion la funcion puede terminar

guardar();
/*
note.save().then(result => {
    console.log('note saved at DB')
})

note2.save().then(result => {
    console.log('note2 saved at DB');
    mongoose.connection.close()
})
*/
// Note.find({}).then(result => {
//     result.forEach(data => {
//         console.log(data)
//     })
//     mongoose.connection.close()
// })

