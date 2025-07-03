import { useState } from "react";
import "./Login.css";

function Login({ onLoginSuccess }) {
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
        debugger;
      const response = await fetch("http://localhost:5500/fazer-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Login bem-sucedido:", data);
        setMessage("Login realizado com sucesso!");
        
        // Chama a função de sucesso do login passando o email
        if (onLoginSuccess) {
          onLoginSuccess(email);
        }
      } else {      
        const errorData = await response.text();
        setMessage(`Erro: ${errorData}`);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMessage("Erro de conexão. Verifique se o servidor está rodando.");
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
            <div className={`message ${message.includes("sucesso") ? "success" : "error"}`}>
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
            Não tem uma conta? <a href="#">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
