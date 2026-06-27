const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cliente_nome: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  cliente_telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  endereco_cep: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  endereco_rua: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  endereco_numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  endereco_complemento: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  endereco_bairro: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  endereco_cidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  forma_pagamento: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  troco_para: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'novo',
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tempo_estimado: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '35-45 min',
  },
}, {
  tableName: 'orders',
});

module.exports = Order;
