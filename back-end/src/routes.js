import { Router } from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const router = Router();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xgeyryb.mongodb.net/db_viajei`
  )
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Armazenamento temporário de cadastros pendentes (em memória)
const cadastrosPendentes = {};

router.get("/buscar-usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar usuários");
  }
});

router.post("/deletar-usuario", async (req, res) => {
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

router.post("/fazer-login", (req, res) => {
  const { email, senha } = req.body;
  Usuario.findOne({ email, senha })
    .then((usuario) => {
      if (usuario) {
        res.send("Login bem-sucedido!");
      } else {
        res.status(401).send("Credenciais inválidas");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Erro ao fazer login");
    });
});

router.post("/cadastrar-usuario", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Gera um token único
    const token = crypto.randomBytes(32).toString("hex");

    // Salva os dados temporariamente
    cadastrosPendentes[token] = { nome, email, senha, criadoEm: Date.now() };

    // Envia o e-mail de confirmação
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const confirmUrl = `http://localhost:${process.env.PORT}/confirmar-cadastro?token=${token}`;
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Confirmação de Cadastro - Viajei",
      text: `Olá ${nome},\n\nClique no link para confirmar seu cadastro: ${confirmUrl}`,
    };
    await transporter.sendMail(mailOptions);
    res.send("E-mail de confirmação enviado. Verifique sua caixa de entrada.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar e-mail de confirmação");
  }
});

router.get("/confirmar-cadastro", async (req, res) => {
  const { token } = req.query;
  const dados = cadastrosPendentes[token];
  if (!dados) {
    return res.status(400).send("Token inválido ou expirado.");
  }
  try {
    await Usuario.create({
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
    });
    delete cadastrosPendentes[token];
    res.send("Cadastro confirmado com sucesso! Você já pode fazer login.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao confirmar cadastro");
  }
});

export default router;
