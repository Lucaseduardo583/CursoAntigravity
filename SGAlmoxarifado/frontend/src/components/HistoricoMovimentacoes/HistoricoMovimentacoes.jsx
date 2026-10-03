import React, { useState, useEffect } from 'react';
import { buscarMovimentacoes, buscarProdutos, buscarUsuarios } from '../../services/api';
import './HistoricoMovimentacoes.css';

// Formata data ISO para padrão legível no Brasil
export function formatarDataBr(dataIso) {
  if (!dataIso) return '-';
  const d = new Date(dataIso);
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Associa o ID do produto e usuário com os respectivos nomes
function mapearNomes(id, lista, campo = 'nome') {
  const item = lista.find((elem) => String(elem.id) === String(id));
  return item ? item[campo] : `#${id}`;
}

export default function HistoricoMovimentacoes({ gatilhoAtualizacao }) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Atualiza histórico e dados complementares para exibição
  useEffect(() => {
    async function sincronizarHistorico() {
      try {
        const [movs, prods, users] = await Promise.all([
          buscarMovimentacoes(),
          buscarProdutos(),
          buscarUsuarios(),
        ]);
        setMovimentacoes(movs.reverse());
        setProdutos(prods);
        setUsuarios(users);
      } catch (err) {
        console.error('Falha ao carregar histórico:', err);
      }
    }
    sincronizarHistorico();
  }, [gatilhoAtualizacao]);

  return (
    <div className="card-historico glass-panel">
      <div className="card-header">
        <div className="icon-badge">📋</div>
        <div>
          <h3>Histórico Recente</h3>
          <p className="subtitulo">Registro auditável de entradas e saídas</p>
        </div>
      </div>

      <div className="tabela-container">
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th className="texto-centro">Quantidade</th>
              <th>Operador</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.length === 0 ? (
              <tr>
                <td colSpan="5" className="texto-vazio">Nenhuma movimentação registrada.</td>
              </tr>
            ) : (
              movimentacoes.slice(0, 8).map((m) => (
                <tr key={m.id}>
                  <td className="data-col">{formatarDataBr(m.data)}</td>
                  <td className="produto-col">{mapearNomes(m.produto_id, produtos)}</td>
                  <td>
                    <span className={`badge badge-${m.tipo}`}>
                      {m.tipo === 'entrada' ? '▲ ENTRADA' : '▼ SAÍDA'}
                    </span>
                  </td>
                  <td className="texto-centro">
                    <strong className="qtd-historico">{m.quantidade_movimentada} un</strong>
                  </td>
                  <td className="operador-col">{mapearNomes(m.usuario_id, usuarios)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
