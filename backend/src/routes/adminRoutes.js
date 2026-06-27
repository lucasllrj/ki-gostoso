const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');

// Login (sem auth)
router.post('/login', authController.login);

// Rotas protegidas
router.use(authMiddleware);

// Produtos (admin - inclui inativos)
router.get('/products', productController.listarTodos);
router.post('/products', upload.single('imagem'), productController.criar);
router.put('/products/:id', upload.single('imagem'), productController.atualizar);
router.delete('/products/:id', productController.deletar);

// Categorias (admin)
router.get('/categories', categoryController.listar);
router.post('/categories', categoryController.criar);
router.put('/categories/:id', categoryController.atualizar);
router.delete('/categories/:id', categoryController.deletar);

// Pedidos (admin)
router.get('/orders', orderController.listar);
router.get('/orders/:id', orderController.buscarPorId);
router.patch('/orders/:id/status', orderController.alterarStatus);

module.exports = router;
