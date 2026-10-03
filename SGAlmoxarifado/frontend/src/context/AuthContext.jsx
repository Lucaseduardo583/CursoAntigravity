import React, { createContext, useContext, useState, useEffect } from 'react';

const CHAVE_STORAGE = 'sg_almoxarifado_usuario';
const AuthContext = createContext(null);

// Recupera a sessão armazenada no navegador
function obterSessaoSalva() {
  try {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

// Grava os dados do usuário autenticado no armazenamento local
function gravarSessao(usuario) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(usuario));
}

// Remove os dados da sessão ativa no navegador
function removerSessao() {
  localStorage.removeItem(CHAVE_STORAGE);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obterSessaoSalva);

  // Efetua login e persiste os dados da sessão
  function login(dadosUsuario) {
    gravarSessao(dadosUsuario);
    setUsuario(dadosUsuario);
  }

  // Encerra a sessão ativa do usuário
  function logout() {
    removerSessao();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, autenticado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumo do contexto de autenticação
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return contexto;
}
