const { Order, OrderItem, Product } = require('../models');
const sequelize = require('../config/database');

const criar = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      cliente_nome,
      cliente_telefone,
      endereco_cep,
      endereco_rua,
      endereco_numero,
      endereco_complemento,
      endereco_bairro,
      endereco_cidade,
      forma_pagamento,
      troco_para,
      itens,
    } = req.body;

    // Validações
    if (!cliente_nome) {
      return res.status(400).json({ error: 'Nome do cliente é obrigatório' });
    }
    if (!endereco_cep || !endereco_rua || !endereco_numero || !endereco_bairro || !endereco_cidade) {
      return res.status(400).json({ error: 'Endereço completo é obrigatório' });
    }
    if (endereco_cidade !== 'Salvador') {
      return res.status(400).json({ error: 'Entregas somente para Salvador' });
    }
    if (!forma_pagamento) {
      return res.status(400).json({ error: 'Forma de pagamento é obrigatória' });
    }
    if (forma_pagamento === 'dinheiro' && (!troco_para || troco_para <= 0)) {
      return res.status(400).json({ error: 'Informe para qual valor precisa de troco' });
    }
    if (!itens || itens.length === 0) {
      return res.status(400).json({ error: 'Carrinho deve conter pelo menos 1 item' });
    }

    // Calcular total e validar produtos
    let total = 0;
    const itensProcessados = [];

    for (const item of itens) {
      const produto = await Product.findByPk(item.product_id);
      if (!produto) {
        await t.rollback();
        return res.status(400).json({ error: `Produto ${item.product_id} não encontrado` });
      }
      if (!produto.ativo) {
        await t.rollback();
        return res.status(400).json({ error: `Produto "${produto.nome}" não está disponível` });
      }
      const subtotal = parseFloat(produto.preco) * item.quantidade;
      total += subtotal;
      itensProcessados.push({
        product_id: item.product_id,
        quantidade: item.quantidade,
        preco_unitario: parseFloat(produto.preco),
        observacao: item.observacao || null,
      });
    }

    if (forma_pagamento === 'dinheiro' && parseFloat(troco_para) < total) {
      await t.rollback();
      return res.status(400).json({ error: 'O valor para troco deve ser maior ou igual ao total do pedido' });
    }

    // Criar pedido
    const pedido = await Order.create(
      {
        cliente_nome,
        cliente_telefone,
        endereco_cep,
        endereco_rua,
        endereco_numero,
        endereco_complemento,
        endereco_bairro,
        endereco_cidade,
        forma_pagamento,
        troco_para: forma_pagamento === 'dinheiro' ? troco_para : null,
        total: total.toFixed(2),
        status: 'novo',
        tempo_estimado: '35-45 min',
      },
      { transaction: t }
    );

    // Criar itens do pedido
    for (const item of itensProcessados) {
      await OrderItem.create(
        { ...item, order_id: pedido.id },
        { transaction: t }
      );
    }

    await t.commit();

    // Buscar pedido completo
    const pedidoCompleto = await Order.findByPk(pedido.id, {
      include: [
        {
          model: OrderItem,
          as: 'itens',
          include: [{ model: Product, as: 'produto', attributes: ['id', 'nome', 'imagem'] }],
        },
      ],
    });

    return res.status(201).json(pedidoCompleto);
  } catch (err) {
    await t.rollback();
    console.error('Erro ao criar pedido:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'itens',
          include: [{ model: Product, as: 'produto', attributes: ['id', 'nome', 'imagem', 'preco'] }],
        },
      ],
    });
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    return res.json(pedido);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const listar = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const pedidos = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'itens',
          include: [{ model: Product, as: 'produto', attributes: ['id', 'nome', 'imagem'] }],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return res.json(pedidos);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const alterarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['novo', 'em_preparo', 'pronto', 'entregue', 'cancelado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const pedido = await Order.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    await pedido.update({ status });
    return res.json(pedido);
  } catch (err) {
    console.error('Erro ao alterar status:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { criar, buscarPorId, listar, alterarStatus };
