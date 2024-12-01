const mongoose = require('mongoose');

// Conexão com o MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/trabalho2'); // Use apenas a URL do banco
    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1); // Finaliza a aplicação em caso de erro
  }
};

module.exports = connectDB;
