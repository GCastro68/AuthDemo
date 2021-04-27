// Usuarios      202104221150    GACC
const mongoose = require('mongoose');
bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
});

//Se crea la función findAndValidate
//Se pueden crear cualquiefunción después de userSchema.statics.
userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

//Se crea un middleware para que al momento de guardar en la BD
//Mongo cree el password encriptado, se usa .pre para que la función se ejecute
//antes de guardar en la BD el password
userSchema.pre('save', async function (next) {
    // await ya que necesita tiempo, son 12 rounds, por eso se define la función async

    //Si el password no ha sido modificado continua con grabar en la BD
    if (!this.isModified('password')) return next();

    //En caso de que el password haya sido modificado se calcula de nuevo
    //la encriptación del password
    this.password = await bcrypt.hash(this.password, 12);
    next();    //En este caso es save
});

module.exports = mongoose.model('User', userSchema);

