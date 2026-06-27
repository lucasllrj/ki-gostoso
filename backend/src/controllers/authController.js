const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'kigostoso_secret_key_2024',
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { login };
