import React, { useState, useEffect } from 'react';
import {
  buscarMaquinas,
  buscarProdutos,
  buscarUsuarios,
  atualizarMaquina,
  atualizarEstoque,
  criarMovimentacao,
} from '../../services/api';
import { criarPayloadConcluirImpressao } from '../../utils/maquinaUtils';
import { BANNER_LAB } from '../../utils/imagensAssets';
import CardMaquina from './CardMaquina';
import PainelFilamentos from './PainelFilamentos';
import ModalNovaImpressao from './ModalNovaImpressao';
import './Laboratorio3D.css';

// Filtra apenas os produtos que são filamentos ou resinas
function filtrarFilamentos(produtos) {
  return produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes('filamento') ||
      p.nome.toLowerCase().includes('resina')
  );
}

export default function Laboratorio3D({ onAtualizacaoGeral, gatilhoAtualizacao }) {
  const [maquinas, setMaquinas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Carrega e sincroniza máquinas, filamentos e usuários
  useEffect(() => {
    async function carregarDadosLab() {
      try {
        const [listaMaquinas, listaProdutos, listaUsuarios] = await Promise.all([
          buscarMaquinas(),
          buscarProdutos(),
          buscarUsuarios(),
        ]);
        setMaquinas(listaMaquinas);
        setProdutos(listaProdutos);
        setUsuarios(listaUsuarios);
      } catch {
        setFeedback({ tipo: 'erro', texto: 'Erro ao conectar ao laboratório 3D.' });
      }
    }
    carregarDadosLab();
  }, [gatilhoAtualizacao]);

  const filamentos = filtrarFilamentos(produtos);

  // Inicia trabalho na impressora e debita 1 bobina do estoque no almoxarifado
  async function executarInicioImpressao(maquinaId, dadosMaquina, filamentoId) {
    try {
      const filamento = produtos.find((p) => String(p.id) === String(filamentoId));
      if (!filamento || filamento.quantidade_estoque <= 0) {
        return setFeedback({ tipo: 'erro', texto: 'Filamento sem estoque suficiente!' });
      }
      await atualizarMaquina(maquinaId, dadosMaquina);
      const novoEstoque = filamento.quantidade_estoque - 1;
      await atualizarEstoque(filamentoId, novoEstoque);
      await criarMovimentacao({
        produto_id: filamentoId,
        usuario_id: dadosMaquina.operador_id,
        tipo: 'saida',
        quantidade_movimentada: 1,
        data: new Date().toISOString(),
      });
      setFeedback({ tipo: 'sucesso', texto: 'Impressão 3D iniciada e 1 bobina debitada!' });
      if (onAtualizacaoGeral) onAtualizacaoGeral();
    } catch {
      setFeedback({ tipo: 'erro', texto: 'Falha ao iniciar processo de impressão.' });
    }
  }

  // Finaliza a impressão e retorna o status da máquina para disponível
  async function executarConclusaoImpressao(maquinaId) {
    try {
      await atualizarMaquina(maquinaId, criarPayloadConcluirImpressao());
      setFeedback({ tipo: 'sucesso', texto: 'Máquina liberada e pronta para nova peça!' });
      if (onAtualizacaoGeral) onAtualizacaoGeral();
    } catch {
      setFeedback({ tipo: 'erro', texto: 'Falha ao liberar máquina 3D.' });
    }
  }

  const emOperacao = maquinas.filter((m) => m.status === 'imprimindo').length;
  const disponiveis = maquinas.filter((m) => m.status === 'disponivel').length;

  return (
    <div className="laboratorio-container">

      {/* Banner hero do laboratório com imagem real */}
      <div className="lab-hero-banner">
        <img src={BANNER_LAB} alt="Laboratório 3D" className="lab-hero-img" />
        <div className="lab-hero-overlay">
          <div className="lab-hero-conteudo">
            <span className="lab-hero-tag">⚡ Manufatura Aditiva</span>
            <h2 className="lab-hero-titulo">Laboratório de Impressão 3D</h2>
            <p className="lab-hero-sub">Monitoramento em tempo real • Gestão de filamentos • Controle de produção</p>
          </div>
          <div className="metricas-resumo">
            <div className="metrica-item">
              <span className="metrica-num">{maquinas.length}</span>
              <span className="metrica-desc">Impressoras</span>
            </div>
            <div className="metrica-item destaque-ativo">
              <span className="metrica-num">{emOperacao}</span>
              <span className="metrica-desc">Em Impressão</span>
            </div>
            <div className="metrica-item destaque-livre">
              <span className="metrica-num">{disponiveis}</span>
              <span className="metrica-desc">Disponíveis</span>
            </div>
            <div className="metrica-item">
              <span className="metrica-num">{filamentos.length}</span>
              <span className="metrica-desc">Filamentos</span>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`alerta-box alerta-${feedback.tipo}`}>
          <span>{feedback.tipo === 'sucesso' ? '✓' : '⚠️'}</span>
          <span>{feedback.texto}</span>
        </div>
      )}

      <div className="secao-titulo">
        <h3>Impressoras 3D Ativas</h3>
        <span className="badge-contagem">{maquinas.length} unidades</span>
      </div>

      <div className="grid-maquinas">
        {maquinas.map((m) => (
          <CardMaquina
            key={m.id}
            maquina={m}
            filamentos={filamentos}
            usuarios={usuarios}
            onAbrirImpressao={setMaquinaSelecionada}
            onConcluirImpressao={executarConclusaoImpressao}
          />
        ))}
      </div>

      <PainelFilamentos filamentos={filamentos} />

      {maquinaSelecionada && (
        <ModalNovaImpressao
          maquina={maquinaSelecionada}
          filamentos={filamentos}
          onFechar={() => setMaquinaSelecionada(null)}
          onConfirmar={executarInicioImpressao}
        />
      )}
    </div>
  );
}
