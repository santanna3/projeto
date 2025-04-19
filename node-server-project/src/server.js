import express from "express";
import mongoose from "mongoose";

const PORT = 5500;

mongoose.connect(
  "mongodb+srv://gbsantanna2:Hsegb36.@cluster0.xgeyryb.mongodb.net/db_viajei"
);

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
});
const Usuario = mongoose.model("Usuario", usuarioSchema); 



const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
