import { useState } from 'react';
import Cadastro from './Cadastro'; // Importe o componente de cadastro
import Login from './Login'; // Importe o componente de login
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('hoteis');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 hóspedes, 1 quarto');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLoginSuccess = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    // Buscar nome do usuário pelo email
    fetch('http://localhost:5500/buscar-usuarios')
      .then(res => res.json())
      .then(users => {
        const user = users.find(u => u.email === email);
        setUserName(user ? user.nome : '');
      });
    setActiveTab('hoteis'); // Volta para a página principal
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setActiveTab('hoteis');
  };

  const handleDeactivateAccount = async () => {
    if (!userEmail) return;
    if (!window.confirm('Tem certeza que deseja desativar sua conta?')) return;
    try {
      // Buscar o usuário pelo email para obter o ID
      const res = await fetch('http://localhost:5500/buscar-usuarios');
      const users = await res.json();
      const user = users.find(u => u.email === userEmail);
      if (!user) {
        alert('Usuário não encontrado.');
        return;
      }
      // Deletar o usuário
      const delRes = await fetch('http://localhost:5500/deletar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user._id })
      });
      if (delRes.ok) {
        alert('Conta desativada com sucesso!');
        handleLogout();
      } else {
        alert('Erro ao desativar a conta.');
      }
    } catch (err) {
      alert('Erro de conexão ao desativar a conta.');
    }
  };

  return (
    <div className="app">
      {/* Cabeçalho com botões clicáveis */}
      <header className="header">
        <button 
          className={`tab-button ${activeTab === 'viagens' ? 'active' : ''}`}
          onClick={() => handleTabClick('viagens')}
        >
          Viagens
        </button>
        <button 
          className={`tab-button ${activeTab === 'hoteis' ? 'active' : ''}`}
          onClick={() => handleTabClick('hoteis')}
        >
          Hotéis
        </button>
        <button 
          className={`tab-button ${activeTab === 'voos' ? 'active' : ''}`}
          onClick={() => handleTabClick('voos')}
        >
          Voos
        </button>
        <button 
          className={`tab-button ${activeTab === 'pacotes' ? 'active' : ''}`}
          onClick={() => handleTabClick('pacotes')}
        >
          Pacotes
        </button>
        <button 
          className="register-button"
          onClick={() => handleTabClick('cadastro')}
        >
          Cadastro
        </button>
        <button 
          className="login-button"
          onClick={() => handleTabClick('login')}
        >
          {isAuthenticated ? `Olá, ${userName}` : 'Login'}
        </button>
        {isAuthenticated && (
          <>
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Sair
            </button>
            <button
              className="deactivate-button"
              onClick={() => handleDeactivateAccount()}
            >
              Desativar conta
            </button>
          </>
        )}       
      </header>

      {/* Seção principal */}
      <main className="main-content">
        {activeTab === 'cadastro' ? (
          <Cadastro />
        ) : activeTab === 'login' ? (
          <Login onLoginSuccess={handleLoginSuccess} onGoToCadastro={() => setActiveTab('cadastro')} />
        ) : (
          <>
            <h1>Economize até 50% na sua próxima estadia</h1>
            <p className="subtitle">Comparamos preços de hotéis de mais de 100 sites</p>

            {/* Formulário de busca */}
            <div className="search-container">
              <div className="search-row">
                <div className="search-field">
                  <label>Para onde?</label>
                  <input 
                    type="text" 
                    placeholder="Digite um destino"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>Entrada</label>
                  <input
                    type="date"
                    className="date-input"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>Saída</label>
                  <input 
                    type="date"
                    className="date-input"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>Hóspedes e quartos</label>
                  <div className="guests-placeholder">{guests}</div>
                </div>
              </div>
            </div>

            {/* Marcas parceiras */}
            <div className="partners">
              <p>Comparamos preços em:</p>
              <div className="partner-logos">
                <span>Booking.com</span>
                <span>Hotels.com</span>
                <span>Expedia</span>
                <span>Trip.com</span>
                <span>100+ outros sites</span>
              </div>
            </div>

            {/* Benefícios */}
            <div className="benefits">
              <div className="benefit-item">
                <span>🔍</span>
                <p>Busca rápida</p>
              </div>
              <div className="benefit-item">
                <span>📊</span>
                <p>Comparação abrangente</p>
              </div>
              <div className="benefit-item">
                <span>💲</span>
                <p>Ótimas ofertas</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;