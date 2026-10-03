import React, { useState } from 'react';
import { criarPayloadIniciarImpressao } from '../../utils/maquinaUtils';
import { useAuth } from '../../context/AuthContext';

export default function ModalNovaImpressao({
  maquina,
  filamentos,
  onFechar,
  onConfirmar,
}) {
  const { usuario } = useAuth();
  const [projeto, setProjeto] = useState('');
  const [filamentoId, setFilamentoId] = useState(filamentos[0]?.id || '');
  const [carregando, setCarregando] = useState(false);

  // Coordena envio e aciona a callback de confirmação
  async function handleSubmit(e) {
    e.preventDefault();
    if (!projeto.trim()) return;

    setCarregando(true);
    try {
      const dados = criarPayloadIniciarImpressao(projeto, filamentoId, usuario.id);
      await onConfirmar(maquina.id, dados, filamentoId);
      onFechar();
    } finally {
      setCarregando(false);
    }
  }

  const filamentoEscolhido = filamentos.find((f) => String(f.id) === String(filamentoId));

  return (
    <div className="modal-overlay">
      <div className="modal-conteudo glass-panel">
        <div className="modal-cabecalho">
          <div>
            <h3>Iniciar Trabalho 3D</h3>
            <span className="subtitulo">Máquina: {maquina.nome}</span>
          </div>
          <button type="button" className="btn-fechar-modal" onClick={onFechar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="campo-grupo">
            <label>Nome do Projeto / Arquivo G-code</label>
            <input
              type="text"
              placeholder="Ex: Suporte de Painel Solar V2.stl"
              value={projeto}
              onChange={(e) => setProjeto(e.target.value)}
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Filamento do Almoxarifado</label>
            <select value={filamentoId} onChange={(e) => setFilamentoId(e.target.value)} required>
              {filamentos.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome} — [Estoque: {f.quantidade_estoque} bobinas]
                </option>
              ))}
            </select>
          </div>

          {filamentoEscolhido && (
            <div className="aviso-consumo">
              📦 Esta ação debitará 1 unidade de <strong>{filamentoEscolhido.nome}</strong> no almoxarifado.
            </div>
          )}

          <div className="modal-botoes">
            <button type="button" className="btn-cancelar" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" disabled={carregando} className="btn-confirmar-impressao">
              {carregando ? 'Iniciando...' : 'Confirmar e Iniciar Impressão →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
