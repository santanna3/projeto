import { useState } from "react";
import "./Login.css";

function Login({ onLoginSuccess, onGoToCadastro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Buscar todos os usuários
      const res = await fetch("http://localhost:5500/buscar-usuarios");
      const usuarios = await res.json();
      const usuarioExistente = usuarios.find((u) => u.email === email);
      if (!usuarioExistente) {
        setMessage("Não existe usuário cadastrado com esse email.");
        setLoading(false);
        return;
      }
    } catch (error) {
      setMessage("Erro ao buscar usuários.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/fazer-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      if (response.ok) {
        const data = await response.text();
        setMessage("Login realizado com sucesso!");
        if (onLoginSuccess) {
          onLoginSuccess(email);
        }
      } else {
        const errorData = await response.text();
        setMessage(`Erro: ${errorData}`);
      }
    } catch (error) {
      setMessage("Erro ao fazer login. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Faça seu Login</h2>
        <p className="login-subtitle">Acesse sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="login-form">
          {message && (
            <div
              className={`message ${
                message.includes("sucesso") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar de mim</label>
            </div>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <span>🔍</span>
            Continuar com Google
          </button>
          <button className="social-button facebook">
            <span>📘</span>
            Continuar com Facebook
          </button>
        </div>

        <div className="login-footer">
          <p>
            Não tem uma conta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onGoToCadastro) onGoToCadastro();
              }}
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
