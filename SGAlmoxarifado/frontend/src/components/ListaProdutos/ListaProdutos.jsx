import React, { useState, useEffect } from 'react';
import { buscarProdutos } from '../../services/api';
import './ListaProdutos.css';

// Determina a etiqueta de status visual com base no volume em estoque
export function obterStatusEstoque(quantidade) {
  if (quantidade <= 0) return { label: 'Esgotado', classe: 'status-zerado' };
  if (quantidade <= 15) return { label: 'Estoque Baixo', classe: 'status-baixo' };
  return { label: 'Disponível', classe: 'status-ok' };
}

export default function ListaProdutos({ gatilhoAtualizacao }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');

  // Sincroniza a listagem de produtos com a API
  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const dados = await buscarProdutos();
        setProdutos(dados);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [gatilhoAtualizacao]);

  // Filtra produtos por nome ou SKU em tempo real
  const produtosFiltrados = produtos.filter((p) => {
    const termo = filtro.toLowerCase();
    return p.nome.toLowerCase().includes(termo) || p.sku.toLowerCase().includes(termo);
  });

  return (
    <div className="card-produtos glass-panel">
      <div className="cabecalho-lista">
        <div>
          <h3>Estoque em Tempo Real</h3>
          <p className="subtitulo">Acompanhamento e inventário de itens</p>
        </div>
        <div className="busca-box">
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {carregando ? (
        <div className="carregando-alerta">Atualizando estoque...</div>
      ) : (
        <div className="tabela-container">
          <table className="tabela-estoque">
            <thead>
              <tr>
                <th>Item / Produto</th>
                <th>SKU</th>
                <th className="texto-centro">Saldo</th>
                <th className="texto-direita">Status</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((item) => {
                const status = obterStatusEstoque(item.quantidade_estoque);
                return (
                  <tr key={item.id}>
                    <td>
                      <span className="nome-produto">{item.nome}</span>
                    </td>
                    <td>
                      <code className="sku-tag">{item.sku}</code>
                    </td>
                    <td className="texto-centro">
                      <span className="saldo-destaque">{item.quantidade_estoque} un</span>
                    </td>
                    <td className="texto-direita">
                      <span className={`status-badge ${status.classe}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
