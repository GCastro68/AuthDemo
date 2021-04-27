// Usuarios      202104221150    GACC
const mongoose = require('mongoose');
//bcrypt = require('bcrypt');

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
// userSchema.statics.findAndValidate = async function (username, password) {
//     const foundUser = await this.findOne({ username });
//     const isValid = await bcrypt.compare(password, foundUser.password);
//     return isValid ? foundUser : false;
// }

module.exports = mongoose.model('User', userSchema);

