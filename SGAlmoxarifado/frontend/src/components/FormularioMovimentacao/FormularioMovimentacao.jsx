import React, { useState, useEffect } from 'react';
import { buscarProdutos, atualizarEstoque, criarMovimentacao } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { calcularNovoSaldo, validarMovimentacao, montarPayload } from '../../utils/movimentacaoUtils';
import './FormularioMovimentacao.css';

// Persiste no backend via POST em /movimentacoes e PATCH em /produtos/:id
async function persistirOperacao(prodId, userId, tipo, qtd, novoSaldo) {
  const dados = montarPayload(prodId, userId, tipo, qtd);
  await criarMovimentacao(dados);
  await atualizarEstoque(prodId, novoSaldo);
}

export default function FormularioMovimentacao({ onMovimentacaoRealizada, gatilhoAtualizacao }) {
  const { usuario } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [quantidade, setQuantidade] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Efeito para carregar a lista de produtos atualizada
  useEffect(() => {
    async function carregar() {
      try {
        const listaProd = await buscarProdutos();
        setProdutos(listaProd);
        if (listaProd.length > 0 && !produtoId) setProdutoId(listaProd[0].id);
      } catch {
        setFeedback({ tipo: 'erro', texto: 'Falha ao buscar produtos.' });
      }
    }
    carregar();
  }, [gatilhoAtualizacao]);

  const produtoAtual = produtos.find((p) => String(p.id) === String(produtoId));

  // Coordena a execução da transação associando ao usuário autenticado
  async function executarTransacao(qtdNum) {
    setCarregando(true);
    try {
      const novoSaldo = calcularNovoSaldo(produtoAtual.quantidade_estoque, qtdNum, tipo);
      await persistirOperacao(produtoId, usuario.id, tipo, qtdNum, novoSaldo);
      setFeedback({ tipo: 'sucesso', texto: 'Movimentação e estoque atualizados com sucesso!' });
      setQuantidade(1);
      if (onMovimentacaoRealizada) onMovimentacaoRealizada();
    } catch {
      setFeedback({ tipo: 'erro', texto: 'Erro de comunicação ao atualizar o estoque.' });
    } finally {
      setCarregando(false);
    }
  }

  // Intercepta a submissão, limpa mensagens e aciona validações prévias
  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);
    const qtdNum = Number(quantidade);
    const erroValidacao = validarMovimentacao(produtoAtual, qtdNum, tipo);
    if (erroValidacao) {
      setFeedback({ tipo: 'erro', texto: erroValidacao });
      return;
    }
    await executarTransacao(qtdNum);
  }

  return (
    <div className="card-movimentacao glass-panel">
      <div className="card-header">
        <div className="icon-badge">⚡</div>
        <div>
          <h3>Nova Movimentação</h3>
          <p className="subtitulo">Entrada ou saída com atualização automática de estoque</p>
        </div>
      </div>

      {feedback && (
        <div className={`alerta-box alerta-${feedback.tipo}`}>
          <span>{feedback.tipo === 'sucesso' ? '✓' : '⚠️'}</span>
          <span>{feedback.texto}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-movimentacao">
        <div className="operador-autenticado-box">
          <span className="operador-label">Operador Autenticado:</span>
          <span className="operador-destaque">
            👤 {usuario ? `${usuario.nome} (${usuario.cargo})` : 'Usuário Anônimo'}
          </span>
        </div>

        <div className="campo-grupo">
          <label>Produto</label>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — [SKU: {p.sku}] (Estoque: {p.quantidade_estoque} un)
              </option>
            ))}
          </select>
        </div>

        <div className="grid-dois-campos">
          <div className="campo-grupo">
            <label>Tipo de Operação</label>
            <div className="radio-tabs">
              <button
                type="button"
                className={`tab-btn ${tipo === 'entrada' ? 'ativo entrada' : ''}`}
                onClick={() => setTipo('entrada')}
              >
                + Entrada
              </button>
              <button
                type="button"
                className={`tab-btn ${tipo === 'saida' ? 'ativo saida' : ''}`}
                onClick={() => setTipo('saida')}
              >
                - Saída
              </button>
            </div>
          </div>

          <div className="campo-grupo">
            <label>Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>
        </div>

        {produtoAtual && (
          <div className="previa-estoque">
            <span>Saldo Atual: <strong>{produtoAtual.quantidade_estoque} un</strong></span>
            <span>Previsão Final: <strong>
              {tipo === 'entrada'
                ? produtoAtual.quantidade_estoque + Number(quantidade || 0)
                : produtoAtual.quantidade_estoque - Number(quantidade || 0)} un
            </strong></span>
          </div>
        )}

        <button type="submit" disabled={carregando} className="btn-acao-principal">
          {carregando ? 'Processando...' : `Confirmar ${tipo === 'entrada' ? 'Entrada' : 'Saída'}`}
        </button>
      </form>
    </div>
  );
}
