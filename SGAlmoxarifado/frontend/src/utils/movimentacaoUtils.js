// Calcula o novo saldo somando na entrada e subtraindo na saída
export function calcularNovoSaldo(saldoAtual, qtd, tipo) {
  return tipo === 'entrada' ? saldoAtual + qtd : saldoAtual - qtd;
}

// Valida consistência e impede saída maior que o estoque disponível
export function validarMovimentacao(produto, qtd, tipo) {
  if (!produto) return 'Selecione um produto cadastrado.';
  if (qtd <= 0) return 'A quantidade precisa ser maior que zero.';
  if (tipo === 'saida' && qtd > produto.quantidade_estoque) {
    return `Estoque insuficiente! Saldo atual disponível: ${produto.quantidade_estoque} un.`;
  }
  return null;
}

// Monta o payload padronizado para o endpoint de movimentações
export function montarPayload(produtoId, usuarioId, tipo, qtd) {
  return {
    produto_id: produtoId,
    usuario_id: usuarioId,
    tipo,
    quantidade_movimentada: qtd,
    data: new Date().toISOString(),
  };
}
