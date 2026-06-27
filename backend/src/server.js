const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imagens de upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ki Gostoso API rodando!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message && err.message.includes('Tipo de arquivo')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');

    await sequelize.sync();
    console.log('Tabelas sincronizadas.');

    app.listen(PORT, () => {
      console.log(`\n🔥 Ki Gostoso API rodando em http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start();
