const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'order_items',
});

OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'pedido' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'produto' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'itens' });

module.exports = OrderItem;
