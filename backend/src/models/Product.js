const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  imagem: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  destaque: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'products',
});

Product.belongsTo(Category, { foreignKey: 'categoria_id', as: 'categoria' });
Category.hasMany(Product, { foreignKey: 'categoria_id', as: 'produtos' });

module.exports = Product;
