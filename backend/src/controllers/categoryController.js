const { Category } = require('../models');

const listar = async (req, res) => {
  try {
    const categorias = await Category.findAll({ order: [['ordem', 'ASC']] });
    return res.json(categorias);
  } catch (err) {
    console.error('Erro ao listar categorias:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const criar = async (req, res) => {
  try {
    const { nome, icone, ordem } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    const categoria = await Category.create({ nome, icone, ordem });
    return res.status(201).json(categoria);
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, icone, ordem } = req.body;
    const categoria = await Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    await categoria.update({ nome, icone, ordem });
    return res.json(categoria);
  } catch (err) {
    console.error('Erro ao atualizar categoria:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    await categoria.destroy();
    return res.json({ message: 'Categoria removida com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar categoria:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { listar, criar, atualizar, deletar };
