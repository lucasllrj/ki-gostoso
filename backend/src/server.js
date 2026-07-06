const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const sequelize = require("./config/database");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || "0.0.0.0";

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const configuredOrigins = parseOrigins(
  process.env.CORS_ORIGIN || process.env.CORS_ORIGINS,
);

const localOriginPatterns = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^http:\/\/\[::1\]:\d+$/,
  /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
  /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$/,
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/+$/, "");

  if (configuredOrigins.includes("*")) return true;
  if (configuredOrigins.includes(normalizedOrigin)) return true;

  return localOriginPatterns.some((pattern) => pattern.test(normalizedOrigin));
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos enviados pelo painel administrativo e imagens usadas no seed.
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Ki Gostoso API rodando!",
  });
});

// Rotas da API
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

// Resposta clara para rotas de API inexistentes
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Rota da API não encontrada",
  });
});

// Permite servir o frontend buildado pelo backend, se existir frontend/dist
const frontendDistPath = path.join(__dirname, "../../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }

    return res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack || err);

  if (err.message && err.message.includes("Tipo de arquivo")) {
    return res.status(400).json({ error: err.message });
  }

  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: err.message });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
});

// Iniciar servidor
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida.");

    await sequelize.sync();
    console.log("Tabelas sincronizadas.");

    app.listen(PORT, HOST, () => {
      console.log(`\n🔥 Ki Gostoso API rodando em http://${HOST}:${PORT}`);
      console.log(`📋 Health check: http://127.0.0.1:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
};

start();
