/**
 * Suposições de endpoints REST adotadas:
 * - GET /api/itens/:codigo/saldo -> Consulta o saldo atual e status de ruptura do item.
 * - POST /api/movimentacoes/retirada -> Efetua a baixa atômica e retorna o registro criado.
 * - GET /api/itens/ruptura -> Retorna todos os materiais em nível crítico/mínimo.
 * A URL base é obtida via variável de ambiente VITE_API_BASE_URL.
 */

import { ItemBalance, WithdrawalPayload, WithdrawalResponse } from '../types/inventory';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';

function buildHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = data?.erro || `Erro HTTP ${res.status}: falha na operação`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export async function fetchItemBalance(itemCode: string): Promise<ItemBalance> {
  const safeCode = encodeURIComponent(itemCode.trim());
  const res = await fetch(`${BASE_URL}/api/itens/${safeCode}/saldo`, {
    headers: buildHeaders(),
  });
  return parseResponse<ItemBalance>(res);
}

export async function submitWithdrawal(payload: WithdrawalPayload): Promise<WithdrawalResponse> {
  const res = await fetch(`${BASE_URL}/api/movimentacoes/retirada`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse<WithdrawalResponse>(res);
}

export async function fetchRuptureItems(): Promise<ItemBalance[]> {
  const res = await fetch(`${BASE_URL}/api/itens/ruptura`, {
    headers: buildHeaders(),
  });
  return parseResponse<ItemBalance[]>(res);
}
