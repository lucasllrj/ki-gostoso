const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'admins',
});

module.exports = Admin;
