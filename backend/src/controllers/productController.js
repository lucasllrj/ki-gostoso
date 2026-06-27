const { Product, Category } = require('../models');

const listar = async (req, res) => {
  try {
    const { categoria_id, destaque, ativo } = req.query;
    const where = {};

    if (categoria_id) where.categoria_id = categoria_id;
    if (destaque !== undefined) where.destaque = destaque === 'true';
    // Public endpoint only shows active products
    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    } else {
      where.ativo = true;
    }

    const produtos = await Product.findAll({
      where,
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'icone'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const listarTodos = async (req, res) => {
  try {
    const { categoria_id } = req.query;
    const where = {};
    if (categoria_id) where.categoria_id = categoria_id;

    const produtos = await Product.findAll({
      where,
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'icone'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json(produtos);
  } catch (err) {
    console.error('Erro ao listar todos os produtos:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Product.findByPk(id, {
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'icone'] }],
    });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const criar = async (req, res) => {
  try {
    const { nome, descricao, preco, categoria_id, ativo, destaque } = req.body;

    if (!nome || !preco || !categoria_id) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
    }

    if (parseFloat(preco) <= 0) {
      return res.status(400).json({ error: 'Preço deve ser maior que zero' });
    }

    const imagem = req.file ? `/uploads/${req.file.filename}` : null;

    const produto = await Product.create({
      nome,
      descricao,
      preco: parseFloat(preco),
      imagem,
      categoria_id: parseInt(categoria_id),
      ativo: ativo !== undefined ? ativo === 'true' : true,
      destaque: destaque === 'true',
    });

    const produtoCompleto = await Product.findByPk(produto.id, {
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'icone'] }],
    });

    return res.status(201).json(produtoCompleto);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Product.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const { nome, descricao, preco, categoria_id, ativo, destaque } = req.body;

    if (preco !== undefined && parseFloat(preco) <= 0) {
      return res.status(400).json({ error: 'Preço deve ser maior que zero' });
    }

    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (preco !== undefined) updateData.preco = parseFloat(preco);
    if (categoria_id !== undefined) updateData.categoria_id = parseInt(categoria_id);
    if (ativo !== undefined) updateData.ativo = ativo === 'true' || ativo === true;
    if (destaque !== undefined) updateData.destaque = destaque === 'true' || destaque === true;
    if (req.file) updateData.imagem = `/uploads/${req.file.filename}`;

    await produto.update(updateData);

    const produtoAtualizado = await Product.findByPk(id, {
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'icone'] }],
    });

    return res.json(produtoAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Product.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    await produto.destroy();
    return res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { listar, listarTodos, buscarPorId, criar, atualizar, deletar };
