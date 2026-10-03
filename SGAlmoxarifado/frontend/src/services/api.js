// Endereço base da API obtido de variáveis de ambiente do Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Função utilitária centralizadora de requisições HTTP
async function requisicao(caminho, opcoes = {}) {
  const configuracao = {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  };
  const resposta = await fetch(`${BASE_URL}${caminho}`, configuracao);
  if (!resposta.ok) {
    throw new Error(`Falha na chamada (${caminho}): ${resposta.statusText}`);
  }
  return resposta.json();
}

// Busca a listagem atualizada de produtos
export function buscarProdutos() {
  return requisicao('/produtos');
}

// Busca um produto específico pelo ID
export function buscarProdutoPorId(id) {
  return requisicao(`/produtos/${id}`);
}

// Atualiza a quantidade em estoque de um produto específico
export function atualizarEstoque(produtoId, novaQuantidade) {
  return requisicao(`/produtos/${produtoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantidade_estoque: novaQuantidade }),
  });
}

// Busca todos os usuários cadastrados no sistema
export function buscarUsuarios() {
  return requisicao('/usuarios');
}

// Registra uma nova movimentação no histórico
export function criarMovimentacao(movimentacao) {
  return requisicao('/movimentacoes', {
    method: 'POST',
    body: JSON.stringify(movimentacao),
  });
}

// Busca as últimas movimentações registradas
export function buscarMovimentacoes() {
  return requisicao('/movimentacoes');
}

// Busca a lista de impressoras 3D cadastradas
export function buscarMaquinas() {
  return requisicao('/maquinas');
}

// Atualiza dados e status operacional de uma máquina 3D específica
export function atualizarMaquina(maquinaId, dados) {
  return requisicao(`/maquinas/${maquinaId}`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  });
}

