// Retorna configuração visual e texto para o status da impressora 3D
export function obterConfigStatus(status) {
  switch (status) {
    case 'imprimindo':
      return { label: 'Imprimindo', classe: 'status-imprimindo', icone: '⚡' };
    case 'disponivel':
      return { label: 'Disponível', classe: 'status-disponivel', icone: '✓' };
    case 'manutencao':
      return { label: 'Manutenção', classe: 'status-manutencao', icone: '🔧' };
    default:
      return { label: 'Desconhecido', classe: 'status-neutro', icone: '•' };
  }
}

// Associa cor visual aproximada para exibição da amostra de filamento
export function obterCorAmostra(nomeFilamento = '') {
  const nome = nomeFilamento.toLowerCase();
  if (nome.includes('preto')) return '#1e293b';
  if (nome.includes('dourado')) return '#fbbf24';
  if (nome.includes('cristal') || nome.includes('transl')) return '#93c5fd';
  if (nome.includes('vermelho')) return '#ef4444';
  if (nome.includes('cinza') || nome.includes('tit')) return '#64748b';
  if (nome.includes('verde')) return '#22c55e';
  return '#a855f7';
}

// Cria o payload de atualização ao iniciar uma nova impressão
export function criarPayloadIniciarImpressao(projeto, filamentoId, operadorId) {
  return {
    status: 'imprimindo',
    projeto: projeto || 'Peça Técnica 3D',
    filamento_id: filamentoId,
    operador_id: operadorId,
    progresso: 5,
    temperatura_bico: 215,
    temperatura_mesa: 60,
    tempo_restante: '02h 30m',
  };
}

// Cria o payload de liberação da máquina após impressão concluída
export function criarPayloadConcluirImpressao() {
  return {
    status: 'disponivel',
    projeto: 'Pronta para Impressão',
    progresso: 0,
    temperatura_bico: 0,
    temperatura_mesa: 0,
    tempo_restante: 'Ociosa',
  };
}
