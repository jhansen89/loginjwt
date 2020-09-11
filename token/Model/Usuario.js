
const mongoose = require("mongoose");
const schema = mongoose.Schema({
idUsuario: Number,
nome:String,
login:String,
password: String,
perfil: String
})
const Usuario = mongoose.model('usuarios', schema)
module.exports = Usuario;