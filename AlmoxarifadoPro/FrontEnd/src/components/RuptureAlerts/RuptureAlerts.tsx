/**
 * Suposições adotadas:
 * - O painel de ruptura consulta a lista de itens críticos via endpoint GET /api/itens/ruptura.
 * - Permite selecionar diretamente qualquer item em alerta para reposição ou consulta.
 */

import { useState, useEffect } from 'react';
import { ItemBalance } from '../../types/inventory';
import { fetchRuptureItems } from '../../services/api';

export function RuptureAlerts({ onSelectItem }: { onSelectItem: (code: string) => void }) {
  const [items, setItems] = useState<ItemBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchRuptureItems()
      .then((data) => { if (active) setItems(data); })
      .catch(() => { if (active) setItems([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <aside aria-label="Alerta de Ruptura de Estoque" className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
        <span className="text-base">⚠</span>
        <span>Atenção Operacional: Itens Abaixo do Estoque Mínimo ({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button
            key={i.codigo}
            type="button"
            onClick={() => onSelectItem(i.codigo)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 text-xs font-medium transition-colors"
          >
            <span className="font-mono font-bold">{i.codigo}</span>
            <span className="text-amber-300/80">({i.nome})</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-900/60 font-bold text-[10px] text-amber-300">
              {i.saldoAtual}/{i.saldoMinimo} un
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
