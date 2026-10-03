import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import FormularioMovimentacao from './components/FormularioMovimentacao/FormularioMovimentacao';
import ListaProdutos from './components/ListaProdutos/ListaProdutos';
import HistoricoMovimentacoes from './components/HistoricoMovimentacoes/HistoricoMovimentacoes';
import Laboratorio3D from './components/Laboratorio3D/Laboratorio3D';
import './App.css';

// Configuração das abas de navegação disponíveis no dashboard
const ABAS = [
  { id: 'almoxarifado', label: '📦 Almoxarifado', titulo: 'Almoxarifado' },
  { id: 'laboratorio', label: '🖨️ Lab 3D', titulo: 'Laboratório 3D' },
];

// Renderiza a interface interna ou tela de login conforme autenticação
function ConteudoApp() {
  const { autenticado } = useAuth();
  const [gatilho, setGatilho] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('almoxarifado');

  // Notifica todos os componentes dependentes para recarregar dados
  function handleAtualizacaoGeral() {
    setGatilho((v) => v + 1);
  }

  if (!autenticado) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Header abaAtiva={abaAtiva} abas={ABAS} onTrocarAba={setAbaAtiva} />

      {abaAtiva === 'almoxarifado' && (
        <main className="layout-grid">
          <div className="painel-lateral">
            <FormularioMovimentacao
              onMovimentacaoRealizada={handleAtualizacaoGeral}
              gatilhoAtualizacao={gatilho}
            />
          </div>
          <div className="painel-conteudo">
            <ListaProdutos gatilhoAtualizacao={gatilho} />
            <HistoricoMovimentacoes gatilhoAtualizacao={gatilho} />
          </div>
        </main>
      )}

      {abaAtiva === 'laboratorio' && (
        <main className="painel-lab">
          <Laboratorio3D
            onAtualizacaoGeral={handleAtualizacaoGeral}
            gatilhoAtualizacao={gatilho}
          />
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConteudoApp />
    </AuthProvider>
  );
}
