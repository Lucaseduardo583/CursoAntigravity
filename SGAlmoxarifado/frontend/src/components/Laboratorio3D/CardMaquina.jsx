import React from 'react';
import { obterConfigStatus, obterCorAmostra } from '../../utils/maquinaUtils';
import { obterIniciais } from '../../utils/usuarioUtils';
import { IMAGENS_MAQUINAS, FALLBACK_MAQUINA } from '../../utils/imagensAssets';

export default function CardMaquina({
  maquina,
  filamentos,
  usuarios,
  onAbrirImpressao,
  onConcluirImpressao,
}) {
  const configStatus = obterConfigStatus(maquina.status);
  const filamentoAtual = filamentos.find((f) => String(f.id) === String(maquina.filamento_id));
  const operadorAtual = usuarios.find((u) => String(u.id) === String(maquina.operador_id));
  const corFilamento = filamentoAtual ? obterCorAmostra(filamentoAtual.nome) : '#475569';
  const imagemMaquina = IMAGENS_MAQUINAS[maquina.id] || FALLBACK_MAQUINA;

  return (
    <div className={`card-maquina-item glass-panel ${configStatus.classe}`}>
      {/* Imagem da impressora com overlay de status */}
      <div className="maquina-img-wrapper">
        <img
          src={imagemMaquina}
          alt={maquina.nome}
          className="maquina-img"
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_MAQUINA; }}
        />
        <div className="maquina-img-overlay"></div>
        <span className={`status-pill-over ${configStatus.classe}`}>
          <span className="pill-dot"></span>
          {configStatus.label}
        </span>
        <span className="tecnologia-badge-over">{maquina.tipo_tecnologia}</span>
      </div>

      <div className="maquina-corpo">
        <h4 className="maquina-nome">{maquina.nome}</h4>

        <div className="projeto-bloco">
          <span className="label-dim">Projeto Atual:</span>
          <strong className="projeto-titulo">🖨️ {maquina.projeto}</strong>
        </div>

        {maquina.status === 'imprimindo' && (
          <div className="progresso-bloco">
            <div className="progresso-labels">
              <span>Progresso da Peça</span>
              <strong>{maquina.progresso}%</strong>
            </div>
            <div className="barra-trilho">
              <div className="barra-preenchimento" style={{ width: `${maquina.progresso}%` }}></div>
            </div>
            <span className="tempo-estimado">⏱️ Tempo restante: {maquina.tempo_restante}</span>
          </div>
        )}

        <div className="telemetria-grid">
          <div className="telemetria-item">
            <span>Bico (Extrusor)</span>
            <strong>🌡️ {maquina.temperatura_bico}°C</strong>
          </div>
          <div className="telemetria-item">
            <span>Mesa Aquecida</span>
            <strong>🔥 {maquina.temperatura_mesa}°C</strong>
          </div>
        </div>

        <div className="detalhes-rodape-maquina">
          <div className="filamento-carregado">
            <span className="amostra-cor-ponto" style={{ backgroundColor: corFilamento }}></span>
            <span className="filamento-texto">
              {filamentoAtual ? filamentoAtual.nome : 'Sem filamento'}
            </span>
          </div>

          {operadorAtual && (
            <div className="operador-mini" title={`Operador: ${operadorAtual.nome}`}>
              <span className="avatar-mini">{obterIniciais(operadorAtual.nome)}</span>
              <span>{operadorAtual.nome.split(' ')[0]}</span>
            </div>
          )}
        </div>

        <div className="maquina-acoes">
          {maquina.status === 'disponivel' && (
            <button
              type="button"
              className="btn-maquina btn-iniciar"
              onClick={() => onAbrirImpressao(maquina)}
            >
              🚀 Iniciar Nova Impressão
            </button>
          )}
          {maquina.status === 'imprimindo' && (
            <button
              type="button"
              className="btn-maquina btn-concluir"
              onClick={() => onConcluirImpressao(maquina.id)}
            >
              ✓ Finalizar / Desocupar
            </button>
          )}
          {maquina.status === 'manutencao' && (
            <button
              type="button"
              className="btn-maquina btn-manutencao"
              onClick={() => onConcluirImpressao(maquina.id)}
            >
              🔧 Concluir Reparo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
