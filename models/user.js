const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    //no se debe mostrar la contraseña
    delete returnedObject.passwordHash; //recordar: esto no se borra de la db sino que cuando se convierte a JSON para mostrar en la web se aplican estos cambios
  }
})

module.exports = mongoose.model('User', userSchema);