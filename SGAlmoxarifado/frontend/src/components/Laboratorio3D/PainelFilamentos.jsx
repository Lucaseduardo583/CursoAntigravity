import React from 'react';
import { obterCorAmostra } from '../../utils/maquinaUtils';
import { obterStatusEstoque } from '../ListaProdutos/ListaProdutos';
import { IMAGENS_FILAMENTOS } from '../../utils/imagensAssets';

// Extrai o tipo do polímero a partir do nome do filamento
function extrairTipoMaterial(nome = '') {
  const n = nome.toUpperCase();
  if (n.includes('PLA')) return 'PLA';
  if (n.includes('PETG')) return 'PETG';
  if (n.includes('TPU')) return 'TPU';
  if (n.includes('ABS')) return 'ABS';
  if (n.includes('RESINA')) return 'RESINA UV';
  return 'FILAMENTO';
}

// Obtém a imagem de fundo correspondente ao tipo de material
function obterImagemFilamento(nome = '') {
  const n = nome.toLowerCase();
  if (n.includes('petg')) return IMAGENS_FILAMENTOS.petg;
  if (n.includes('tpu')) return IMAGENS_FILAMENTOS.tpu;
  if (n.includes('abs')) return IMAGENS_FILAMENTOS.abs;
  return IMAGENS_FILAMENTOS.pla;
}

export default function PainelFilamentos({ filamentos }) {
  return (
    <div className="painel-filamentos glass-panel">
      <div className="filamentos-header">
        <div className="icon-badge">🧵</div>
        <div>
          <h3>Estoque de Filamentos & Insumos 3D</h3>
          <p className="subtitulo">Bobinas e carretéis disponíveis no almoxarifado</p>
        </div>
      </div>

      <div className="filamentos-cards-grid">
        {filamentos.map((f) => {
          const cor = obterCorAmostra(f.nome);
          const tipo = extrairTipoMaterial(f.nome);
          const status = obterStatusEstoque(f.quantidade_estoque);
          const imgSrc = obterImagemFilamento(f.nome);

          return (
            <div key={f.id} className="filamento-card-item">
              {/* Imagem de preview do filamento */}
              <div className="filamento-img-wrap">
                <img
                  src={imgSrc}
                  alt={f.nome}
                  className="filamento-img"
                  loading="lazy"
                  onError={(e) => { e.target.src = IMAGENS_FILAMENTOS.pla; }}
                />
                <div className="filamento-img-overlay" style={{ background: `${cor}33` }}></div>
                <span className="material-pill-over">{tipo}</span>
              </div>

              <div className="filamento-card-body">
                <div className="filamento-topo-row">
                  <span className="amostra-circulo" style={{ backgroundColor: cor }}></span>
                  <span className={`status-badge ${status.classe}`}>{status.label}</span>
                </div>
                <h5 className="filamento-nome">{f.nome}</h5>
                <code className="sku-tag">{f.sku}</code>
                <div className="filamento-saldo-bloco">
                  <span className="saldo-num">{f.quantidade_estoque}</span>
                  <span className="saldo-un">bobinas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
