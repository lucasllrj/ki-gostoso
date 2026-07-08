# Ki Gostoso: Sistema de Pedidos Online

Sistema de pedidos online para o restaurante fictício Ki Gostoso, com cardápio digital, carrinho de compras, checkout com validação de endereço por CEP e painel administrativo.

## Estrutura

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Banco de Dados:** SQLite (Sequelize ORM)
- **Autenticação:** JWT
- **API Externa:** ViaCEP

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 20+)

### 1. Clonar o repositório

```bash
git clone https://github.com/lucasllrj/ki-gostoso.git
cd ki-gostoso
```

### 2. Instalar dependências

```bash
# Backend
cd /backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar o banco de dados

O projeto usa SQLite. Para criar as tabelas e popular o banco com os dados iniciais, execute o seed no backend:

```bash
cd backend
npm run seed
```

Esse comando cria as tabelas, cadastra as categorias, os produtos e o usuário administrador padrão.
Credenciais do administrador:

```txt
Email: admin@kigostoso.com
Senha: admin123
```

### 4. Executar o projeto

O backend e o frontend devem ser executados em terminais separados.

#### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

A API ficará disponível em:

```txt
http://127.0.0.1:3001
```

Para testar se o backend está rodando:

```txt
http://127.0.0.1:3001/api/health
```

#### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

Acesse no navegador:

```txt
http://localhost:5173
```

Painel administrativo:

```txt
http://localhost:5173/admin/login
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
- ✅ Confirmação de pedido

### Administrador

- ✅ Login seguro com JWT
- ✅ Gestão de pedidos
- ✅ Gestão do cardápio (adicionar, editar, ativar/desativar, excluir produtos)
- ✅ Upload de imagens de produtos

## 📁 Estrutura do Projeto

```
ki-gostoso/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuração do banco
│   │   ├── controllers/   # Lógica das operações
│   │   ├── middleware/     # Funções intermediárias: Auth JWT e upload
│   │   ├── models/        # Modelos Sequelize / Dados do sistema
│   │   ├── routes/        # Rotas da API
│   │   └── seeds/         # Dados iniciais
│   └── uploads/           # Imagens de produtos
├── frontend/
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── context/       # Estados globais, CartContext e AuthContext
│       ├── pages/         # Páginas da aplicação
│       └── services/      # Chamadas API
└── README.md
```
