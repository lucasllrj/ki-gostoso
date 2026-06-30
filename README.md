# 🍗 Ki Gostoso — Sistema de Pedidos Online

Sistema completo de pedidos online para o restaurante Ki Gostoso, com cardápio digital, carrinho de compras, checkout com validação de CEP, e painel administrativo.

## 🛠️ Tecnologias

- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Banco de Dados:** SQLite (Sequelize ORM)
- **Autenticação:** JWT
- **API Externa:** ViaCEP (preenchimento automático de endereço)

## 🚀 Como Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18+)

### 1. Clonar o repositório
```bash
git clone https://github.com/lucasllrj/ki-gostoso.git
cd ki-gostoso
```

### 2. Instalar dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar o banco de dados
```bash
cd ../backend
node src/seeds/seed.js
```
Isso cria o banco com 4 categorias, 15 produtos e um admin padrão.

### 4. Iniciar os servidores
```bash
# Terminal 1 - Backend (porta 3001)
cd backend
node src/server.js

# Terminal 2 - Frontend (porta 5173)
cd frontend
npx vite
```

### 5. Acessar
- **Site:** http://localhost:5173
- **Admin:** http://localhost:5173/admin/login

## 📋 Funcionalidades

### Cliente
- ✅ Cardápio com filtro por categorias (Salgados, Refeições, Doces, Bebidas)
- ✅ Detalheamento do produto
- ✅ Carrinho de compras
- ✅ Checkout com preenchimento automático de endereço (ViaCEP)
- ✅ Validação de entrega apenas para Salvador com mensagem informativa em caso de erro
- ✅ Máscara de telefone no formato (xx) x xxxx-xxxx
- ✅ Pagamento na entrega (Dinheiro, Crédito, Débito)
- ✅ Confirmação de pedido com tempo estimado

### Administrador
- ✅ Login seguro com JWT
- ✅ Gestão de pedidos (Novo → Em Preparo → Pronto → Entregue)
- ✅ Gestão do cardápio (adicionar, editar, ativar/desativar, excluir produtos)
- ✅ Upload de imagens de produtos

## 📁 Estrutura do Projeto

```
ki-gostoso/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuração do banco
│   │   ├── controllers/   # Lógica dos endpoints
│   │   ├── middleware/     # Auth JWT e upload
│   │   ├── models/        # Modelos Sequelize
│   │   ├── routes/        # Rotas da API
│   │   └── seeds/         # Dados iniciais
│   └── uploads/           # Imagens de produtos
├── frontend/
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── context/       # CartContext e AuthContext
│       ├── pages/         # Páginas da aplicação
│       └── services/      # Chamadas API
└── README.md
```
