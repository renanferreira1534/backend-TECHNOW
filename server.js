import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 🔹 CONEXÃO COM MYSQL
// =====================================================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tecnow",
  port: 3307, // 👈 importante!
});





db.connect(err => {
  if (err) {
    console.error("❌ Erro ao conectar no MySQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL (banco: tecnow)!");
  }
});

// =====================================================
// 🛍️ PRODUTOS
// =====================================================
app.get("/produtos", (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// =====================================================
// 🛒 CARRINHO
// =====================================================

// Lista itens
app.get("/carrinho", (req, res) => {
  db.query("SELECT * FROM carrinho", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Atualiza quantidade de item
app.post("/carrinho/add", (req, res) => {
  const { produto_id, quantidade } = req.body;
  if (!produto_id || !quantidade)
    return res.status(400).json({ error: "Dados inválidos" });

  const sql = "UPDATE carrinho SET quantidade = ? WHERE id = ?";
  db.query(sql, [quantidade, produto_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Remove item
app.delete("/carrinho/remove/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM carrinho WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// =====================================================
// 👤 USUÁRIOS
// =====================================================

// Cadastro
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha)
    return res.status(400).json({ error: "Preencha todos os campos" });

  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.query(sql, [nome, email, senha], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email já cadastrado" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  db.query(sql, [email, senha], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false });
    }
  });
});

// =====================================================
// 🚀 SERVIDOR
// =====================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
