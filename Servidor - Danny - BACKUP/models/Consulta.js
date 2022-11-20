const mongoose = require('mongoose');
// CRIANDO MODULE DA CONSULTA
const Consulta = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
    cpf: String, 
    number: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean
})

const modelConsulta = mongoose.model('consulta', Consulta); // PEGANDO O ARTIGO

module.exports = modelConsulta;