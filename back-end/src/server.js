import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const publicPath = path.join(__dirname, "../../Front-End/dist");
app.use(express.static(publicPath));
app.use(express.json());

// Usa as rotas da API
app.use(routes);

// Rota catch-all SÓ para GET (SPA React)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});


console.log(`Servidor rodando na porta: ${process.env.PORT}`);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
});