const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — aceita localhost em desenvolvimento
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

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

// Tratamento de erros
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
