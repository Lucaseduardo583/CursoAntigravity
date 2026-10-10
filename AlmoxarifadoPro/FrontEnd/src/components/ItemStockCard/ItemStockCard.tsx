/**
 * Suposições adotadas:
 * - O cartão apresenta feedback em tempo real para o operador sobre a disponibilidade do item.
 * - Caso esteja em alerta de ruptura (saldo <= mínimo), destaca um badge amarelo/vermelho acessível.
 */

import React from 'react';
import { ItemBalance } from '../../types/inventory';

interface ItemStockCardProps {
  item: ItemBalance | null;
  isLoading: boolean;
}

function StockBadge({ isRupture }: { isRupture: boolean }) {
  if (isRupture) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        ALERTA: Estoque Crítico
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
      Estoque Normal
    </span>
  );
}

export function ItemStockCard({ item, isLoading }: ItemStockCardProps) {
  if (isLoading) {
    return (
      <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 animate-pulse text-slate-600 text-sm">
        Consultando saldo atualizado no banco...
      </div>
    );
  }
  if (!item) {
    return (
      <div className="p-5 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm text-center">
        Informe o código do item para visualizar saldo e especificações.
      </div>
    );
  }
  return (
    <section aria-labelledby="card-item-title" className="p-5 border border-slate-300 rounded-lg bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">{item.categoria}</span>
          <h3 id="card-item-title" className="text-lg font-bold text-slate-900">{item.nome}</h3>
          <p className="text-xs font-mono text-slate-600">Código: {item.codigo}</p>
        </div>
        <StockBadge isRupture={item.alertaRuptura} />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 text-center">
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
          <span className="block text-xs font-medium text-slate-600">Saldo Disponível</span>
          <strong className="text-2xl font-black text-slate-900">{item.saldoAtual}</strong>
        </div>
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
          <span className="block text-xs font-medium text-slate-600">Estoque Mínimo</span>
          <strong className="text-2xl font-semibold text-slate-700">{item.saldoMinimo}</strong>
        </div>
      </div>
    </section>
  );
}
