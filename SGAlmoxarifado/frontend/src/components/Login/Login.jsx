import React, { useState, useEffect } from 'react';
import { buscarUsuarios } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { obterIniciais, obterTemaCargo, encontrarUsuario } from '../../utils/usuarioUtils';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [modoAba, setModoAba] = useState('rapido');
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState(null);
  const [processando, setProcessando] = useState(false);

  // Busca a lista de operadores cadastrados no json-server
  useEffect(() => {
    async function carregarLista() {
      try {
        const dados = await buscarUsuarios();
        setUsuarios(dados);
      } catch {
        setErro('Falha ao conectar com o serviço de autenticação.');
      }
    }
    carregarLista();
  }, []);

  // Efetua autenticação direta com perfil selecionado
  function autenticarRapido(usuarioSelecionado) {
    setProcessando(true);
    setErro(null);
    setTimeout(() => {
      login(usuarioSelecionado);
      setProcessando(false);
    }, 300);
  }

  // Valida credenciais manuais e inicia a sessão
  function handleLoginManual(e) {
    e.preventDefault();
    setErro(null);
    if (!identificador.trim()) return setErro('Informe seu nome ou e-mail cadastrado.');

    const encontrado = encontrarUsuario(identificador, usuarios);
    if (!encontrado) {
      return setErro('Usuário não localizado no sistema. Verifique os dados.');
    }

    setProcessando(true);
    setTimeout(() => {
      login(encontrado);
      setProcessando(false);
    }, 300);
  }

  return (
    <div className="login-wrapper">
      <div className="login-backdrop-glow"></div>
      <div className="login-card glass-panel">
        <div className="login-marca">
          <div className="login-icone-logo">📦</div>
          <h2>SGAlmoxarifado</h2>
          <span className="login-subtitulo">Acesso ao Painel Operacional</span>
        </div>

        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${modoAba === 'rapido' ? 'ativo' : ''}`}
            onClick={() => { setModoAba('rapido'); setErro(null); }}
          >
            ⚡ Acesso Rápido
          </button>
          <button
            type="button"
            className={`login-tab ${modoAba === 'manual' ? 'ativo' : ''}`}
            onClick={() => { setModoAba('manual'); setErro(null); }}
          >
            🔑 Credenciais
          </button>
        </div>

        {erro && <div className="login-alerta-erro">⚠️ {erro}</div>}

        {modoAba === 'rapido' ? (
          <div className="perfis-grid">
            <p className="instrucao-rapida">Selecione seu perfil para entrar instantaneamente:</p>
            {usuarios.map((u) => {
              const tema = obterTemaCargo(u.cargo);
              return (
                <button
                  key={u.id}
                  type="button"
                  className={`perfil-card ${tema.classe}`}
                  onClick={() => autenticarRapido(u)}
                  disabled={processando}
                >
                  <div className="perfil-avatar" style={{ background: tema.gradiente }}>
                    {obterIniciais(u.nome)}
                  </div>
                  <div className="perfil-info">
                    <span className="perfil-nome">{u.nome}</span>
                    <span className="perfil-email">{u.email || 'operador@almoxarifado.com'}</span>
                    <span className="perfil-cargo-tag">{tema.label}</span>
                  </div>
                  <span className="perfil-seta">→</span>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleLoginManual} className="login-form">
            <div className="login-campo">
              <label>Nome ou E-mail</label>
              <input
                type="text"
                placeholder="Ex: Carlos Silva ou carlos@almoxarifado.com"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>

            <div className="login-campo">
              <label>Senha / PIN</label>
              <div className="campo-senha-wrap">
                <input
                  type={verSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-ver-senha"
                  onClick={() => setVerSenha(!verSenha)}
                >
                  {verSenha ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={processando} className="btn-login-entrar">
              {processando ? 'Entrando no Sistema...' : 'Entrar no Sistema →'}
            </button>
          </form>
        )}

        <div className="login-rodape">
          <span>🔒 Ambiente seguro integrado com json-server mock</span>
        </div>
      </div>
    </div>
  );
}
