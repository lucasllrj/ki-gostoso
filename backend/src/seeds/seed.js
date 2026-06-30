const bcrypt = require('bcryptjs');
const { sequelize, Category, Product, Admin } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tabelas criadas com sucesso.');

    const senhaHash = await bcrypt.hash('admin123', 10);
    await Admin.create({
      nome: 'Administrador',
      email: 'admin@kigostoso.com',
      senha_hash: senhaHash,
    });
    console.log('Admin padrão criado: admin@kigostoso.com / admin123');

    const [salgados, refeicoes, doces, bebidas] = await Promise.all([
      Category.create({ nome: 'Salgados', icone: 'bakery_dining', ordem: 1 }),
      Category.create({ nome: 'Refeições', icone: 'flatware', ordem: 2 }),
      Category.create({ nome: 'Doces', icone: 'cake', ordem: 3 }),
      Category.create({ nome: 'Bebidas', icone: 'local_bar', ordem: 4 }),
    ]);
    console.log('Categorias criadas.');

    await Product.bulkCreate([
      // Salgados
      { nome: 'Coxinha de Frango', descricao: 'Massa artesanal de batata recheada com frango desfiado suculento e cream cheese. Um clássico que derrete na boca.', preco: 8.50, imagem: '/uploads/coxinha.webp', categoria_id: salgados.id, ativo: true, destaque: true },
      { nome: 'Hambúrguer de Forno', descricao: 'Massa fofinha e artesanal, preparado diariamente com a receita secreta da Ki Gostoso. Feito com carne moída de patinho.', preco: 8.50, imagem: '/uploads/hambúrguer_de_forno.jfif', categoria_id: salgados.id, ativo: true, destaque: false },
      { nome: 'Enroladinho de Salsicha', descricao: 'Massa crocante envolvendo salsicha temperada com orégano especial da casa.', preco: 7.00, imagem: '/uploads/enroladinho_de_salsisha.jfif', categoria_id: salgados.id, ativo: true, destaque: false },
      // Refeições
      { nome: 'Strogonoff da Casa', descricao: 'Carne macia com molho secreto, acompanhado de arroz soltinho e batata palha.', preco: 32.90, imagem: '/uploads/strogonoff_da_casa.jfif', categoria_id: refeicoes.id, ativo: true, destaque: true },
      { nome: 'PF da Casa', descricao: 'Arroz, feijão, bife acebolado e fritas. O prato feito mais completo de Salvador.', preco: 24.90, imagem: '/uploads/PF_da_casa.jfif', categoria_id: refeicoes.id, ativo: true, destaque: false },
      // Doces
      { nome: 'Brigadeirão', descricao: 'O clássico brasileiro elevado ao nível supremo com chocolate belga e granulado artesanal.', preco: 5.00, imagem: '/uploads/brigadeirao.jfif', categoria_id: doces.id, ativo: true, destaque: true },
      { nome: 'Brownie Triplo Choc', descricao: 'Feito com chocolate belga 70% e pedaços generosos de chocolate branco. Casquinha crocante e interior super úmido.', preco: 12.00, imagem: '/uploads/brownie_triplo_choc.jfif', categoria_id: doces.id, ativo: true, destaque: true },
      { nome: 'Cookies Recheados', descricao: 'Massa amanteigada com gotas de chocolate que derretem na boca.', preco: 8.50, imagem: '/uploads/cookie_recheado.jfif', categoria_id: doces.id, ativo: true, destaque: false },
      { nome: 'Quindim Real', descricao: 'Coco ralado e gemas frescas. Um clássico nordestino.', preco: 7.00, imagem: '/uploads/quindim.jfif', categoria_id: doces.id, ativo: true, destaque: false },
      { nome: 'Beijinho de Côco', descricao: 'O par perfeito do brigadeiro. Doce de leite com coco ralado.', preco: 4.50, imagem: '/uploads/beijinho_de_coco.jfif', categoria_id: doces.id, ativo: true, destaque: false },
      { nome: 'Arroz Doce', descricao: 'Com canela e muito cremoso. Uma sobremesa caseira e reconfortante.', preco: 9.00, imagem: '/uploads/arroz_doce.jfif', categoria_id: doces.id, ativo: true, destaque: false },
      // Bebidas
      { nome: 'Suco de Laranja Natural', descricao: 'Suco natural espremido na hora, sem conservantes e muito geladinho.', preco: 10.00, imagem: '/uploads/suco_de_laranja_natural.jfif', categoria_id: bebidas.id, ativo: true, destaque: true },
      { nome: 'Suco de Maracujá', descricao: 'Explosão cítrica refrescante e nutritiva.', preco: 9.00, imagem: '/uploads/suco_de_maracuja.jpg', categoria_id: bebidas.id, ativo: true, destaque: false },
      { nome: 'Coca-Cola Lata', descricao: 'Lata 350ml - Original. Gelada e refrescante.', preco: 8.00, imagem: '/uploads/coca_lata.jfif', categoria_id: bebidas.id, ativo: true, destaque: false },
      { nome: 'Água Mineral', descricao: 'Com ou Sem Gás (500ml).', preco: 5.00, imagem: '/uploads/agua_mineral.jfif', categoria_id: bebidas.id, ativo: true, destaque: false },
    ]);
    console.log('Produtos criados.');

    console.log('\n✅ Seed concluído com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
};

seed();
