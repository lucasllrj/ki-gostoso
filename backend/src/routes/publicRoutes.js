const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');

// Categorias (público)
router.get('/categories', categoryController.listar);

// Produtos (público - apenas ativos)
router.get('/products', productController.listar);
router.get('/products/:id', productController.buscarPorId);

// Pedidos (público - criar e consultar)
router.post('/orders', orderController.criar);
router.get('/orders/:id', orderController.buscarPorId);

module.exports = router;
