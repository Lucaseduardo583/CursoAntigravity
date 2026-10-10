/**
 * Suposições adotadas:
 * - A busca por saldo é acionada manualmente ou ao perder o foco (blur) do campo de código.
 * - Códigos em branco limpam o estado do item e não disparam requisição à rede.
 */

import { useState, useCallback } from 'react';
import { ItemBalance } from '../types/inventory';
import { fetchItemBalance } from '../services/api';

export function useItemLookup() {
  const [item, setItem] = useState<ItemBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const lookup = useCallback(async (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) {
      setItem(null);
      setLookupError(null);
      return;
    }
    setIsLoading(true);
    setLookupError(null);
    try {
      const data = await fetchItemBalance(cleanCode);
      setItem(data);
    } catch (err) {
      setItem(null);
      setLookupError(err instanceof Error ? err.message : 'Falha ao buscar item.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setItem(null);
    setLookupError(null);
  }, []);

  return { item, isLoading, lookupError, lookup, clear, setItem };
}
