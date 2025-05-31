const mongoose = require('mongoose');

const equipeSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  setores: [{
    nome: {
      type: String,
      required: true,
    },
    rodizios: [{
      descricao: {
        type: String,
        required: true,
      },
      dataInicio: {
        type: Date,
      },
      dataFim: {
        type: Date,
      }
    }]
  }]
}, { timestamps: true });

const Equipe = mongoose.model('Equipe', equipeSchema);

module.exports = Equipe;