import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import nodemailer from "nodemailer";

const PORT = 5500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(
    "mongodb+srv://gbsantanna2:Hsegb36.@cluster0.xgeyryb.mongodb.net/db_viajei"
  )
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const app = express();
app.use(cors());
const publicPath = path.join(__dirname, "../front-end/Viajei-React/dist");
app.use(express.static(publicPath));
app.use(express.json());

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

app.get("/buscar-usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar usuários");
  }
});

app.post("/deletar-usuario", async (req, res) => {
  const { id } = req.body;
  try {
    const resultado = await Usuario.findByIdAndDelete(id);
    if (resultado) {
      res.send("Usuário deletado com sucesso!");
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar usuário");
  }
});

app.post("/fazer-login", (req, res) =>{
  const { email, senha } = req.body;
  Usuario.findOne({ email, senha })
    .then(usuario => {
      if (usuario) {
        res.send("Login bem-sucedido!");
      } else {
        res.status(401).send("Credenciais inválidas");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Erro ao fazer login");
    });
});


// Armazenamento temporário de cadastros pendentes (em memória)
const cadastrosPendentes = {};
import crypto from "crypto";

app.post("/cadastrar-usuario", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Gera um token único
    const token = crypto.randomBytes(32).toString("hex");

    console.log(`Token gerado: ${token}`);
    // Salva os dados temporariamente
    cadastrosPendentes[token] = { nome, email, senha, criadoEm: Date.now() };

    // Envia o e-mail de confirmação
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gb.santanna2@gmail.com",
        pass: "glqn gjsa ekhc ojog"
      }
    });
    const confirmUrl = `http://localhost:${PORT}/confirmar-cadastro?token=${token}`;
    const mailOptions = {
      from: "gb.santanna2@gmail.com",
      to: email,
      subject: "Confirmação de Cadastro - Viajei",
      text: `Olá ${nome},\n\nClique no link para confirmar seu cadastro: ${confirmUrl}`
    };
    await transporter.sendMail(mailOptions);
    res.send("E-mail de confirmação enviado. Verifique sua caixa de entrada.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar e-mail de confirmação");
  }
});

app.get("/confirmar-cadastro", async (req, res) => {
  const { token } = req.query;
  const dados = cadastrosPendentes[token];
  if (!dados) {
    return res.status(400).send("Token inválido ou expirado.");
  }
  try {
    await Usuario.create({ nome: dados.nome, email: dados.email, senha: dados.senha });
    delete cadastrosPendentes[token];
    res.send("Cadastro confirmado com sucesso! Você já pode fazer login.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao confirmar cadastro");
  }
});


// MANTENHA TODAS AS ROTAS API ACIMA DESTA LINHA

// Rota catch-all SÓ para GET (SPA React)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
