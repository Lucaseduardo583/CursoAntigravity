import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { obterIniciais, obterTemaCargo } from '../../utils/usuarioUtils';
import './Header.css';

export default function Header({ abaAtiva, abas = [], onTrocarAba }) {
  const { usuario, logout } = useAuth();
  const tema = usuario ? obterTemaCargo(usuario.cargo) : null;

  return (
    <header className="app-header glass-panel">
      <div className="header-logo">
        <div className="logo-icon">📦</div>
        <div>
          <h1>SGAlmoxarifado</h1>
          <span className="logo-tag">Controle de Estoque & Manufatura</span>
        </div>
      </div>

      {/* Navegação por abas entre os módulos */}
      {abas.length > 0 && (
        <nav className="nav-abas">
          {abas.map((aba) => (
            <button
              key={aba.id}
              type="button"
              className={`nav-aba-btn ${abaAtiva === aba.id ? 'ativa' : ''}`}
              onClick={() => onTrocarAba(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </nav>
      )}

      <div className="header-acoes">
        <div className="status-indicator">
          <span className="ping-dot"></span>
          <span>API Ativa</span>
        </div>

        {usuario && (
          <div className="usuario-sessao-box">
            <div className="avatar-header" style={{ background: tema.gradiente }}>
              {obterIniciais(usuario.nome)}
            </div>
            <div className="usuario-detalhes">
              <span className="usuario-nome">{usuario.nome}</span>
              <span className={`cargo-badge ${tema.classe}`}>{tema.label}</span>
            </div>
            <button
              type="button"
              className="btn-logout"
              onClick={logout}
              title="Encerrar sessão"
            >
              <span>Sair</span>
              <span className="logout-icon">⎋</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
