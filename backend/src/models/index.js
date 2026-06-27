const sequelize = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Admin = require('./Admin');

module.exports = {
  sequelize,
  Category,
  Product,
  Order,
  OrderItem,
  Admin,
};
