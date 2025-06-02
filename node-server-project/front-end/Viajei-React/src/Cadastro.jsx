import { useState } from "react";
import "./Cadastro.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      debugger;

      let rota = window.location.origin;

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
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        <label>
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}

export default Cadastro;
