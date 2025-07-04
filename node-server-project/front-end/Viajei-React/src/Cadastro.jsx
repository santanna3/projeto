import { useState } from "react";
import "./Cadastro.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    try {
      // Buscar todos os usuários e verificar se o email já existe
      const res = await fetch("http://localhost:5500/buscar-usuarios");
      const usuarios = await res.json();
      const usuarioExistente = usuarios.find((u) => u.email === email);
      if (usuarioExistente) {
        setMensagem("Já existe um usuário com esse email.");
        setLoading(false);
        return;
      }
    } catch (error) {
      setMensagem("Erro ao validar email. Tente novamente.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5500/cadastrar-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (response.ok) {
        setMensagem("Cadastro realizado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
      } else {
        setMensagem("Erro ao cadastrar. Tente novamente.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>Cadastro</h2>
        <p className="cadastro-subtitle">
          Crie sua conta para aproveitar todos os recursos
        </p>
        <form onSubmit={handleSubmit} className="cadastro-form">
          {mensagem && (
            <div
              className={`mensagem ${
                mensagem.includes("sucesso") ? "success" : "error"
              }`}
            >
              {mensagem}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="cadastro-button"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
