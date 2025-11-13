// Importar as bibliotecas
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Conexão com o banco MySQL
const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3307,
  user: "root",
  password: "",
  database: "mrk"
});

// Iniciar o Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ======= ROTA DO CARRINHO =======
const router = express.Router();

// 🔹 Lista todos os produtos do carrinho
router.get("/", (req, res) => {
  con.query("SELECT * FROM carrinho", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// 🔹 Adiciona um produto ao carrinho
router.post("/add", (req, res) => {
  const { nome, preco, quantidade } = req.body;
  con.query(
    "INSERT INTO carrinho (nome, preco, quantidade) VALUES (?, ?, ?)",
    [nome, preco, quantidade],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Produto adicionado ao carrinho!" });
    }
  );
});

// 🔹 Remove um produto do carrinho pelo ID
router.delete("/remove/:id", (req, res) => {
  const { id } = req.params;
  con.query("DELETE FROM carrinho WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Produto removido com sucesso!" });
  });
});

app.use("/api/carrinho", router);

// ======= FIM DA ROTA DO CARRINHO =======


// ======= ROTA DO DASHBOARD =======
const dashboardRouter = express.Router();

// Pedidos
dashboardRouter.get("/pedidos", (req, res) => {
  con.query("SELECT * FROM pedidos", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Produtos
dashboardRouter.get("/produtos", (req, res) => {
  con.query("SELECT * FROM produtos", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Clientes
dashboardRouter.get("/clientes", (req, res) => {
  con.query("SELECT * FROM clientes", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.use("/api/dashboard", dashboardRouter);
// ======= FIM DO DASHBOARD =======


// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
