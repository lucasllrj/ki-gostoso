const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  icone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'restaurant',
  },
  ordem: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'categories',
});

module.exports = Category;
