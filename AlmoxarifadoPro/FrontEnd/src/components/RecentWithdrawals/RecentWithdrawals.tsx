/**
 * Suposições adotadas:
 * - Exibe a lista das movimentações realizadas na sessão atual pelo operador.
 * - Formata data/hora em padrão legível pt-BR e exibe turno e matrícula com destaque.
 */

import React from 'react';
import { WithdrawalResponse } from '../../types/inventory';

interface RecentWithdrawalsProps {
  movements: WithdrawalResponse[];
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

export function RecentWithdrawals({ movements }: RecentWithdrawalsProps) {
  if (movements.length === 0) {
    return (
      <div className="p-4 border border-slate-200 rounded-lg text-slate-500 text-xs text-center bg-slate-50">
        Nenhuma retirada efetuada nesta sessão.
      </div>
    );
  }

  return (
    <section aria-labelledby="recent-title" className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
      <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
        <h3 id="recent-title" className="text-sm font-bold text-slate-800">
          Retiradas Registradas Nesta Sessão ({movements.length})
        </h3>
      </div>
      <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto" role="list">
        {movements.map((m) => (
          <li key={m.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
            <div>
              <span className="font-mono font-bold text-slate-900">{m.itemCodigo}</span>
              <span className="text-slate-500 ml-2">({m.quantidade} un)</span>
              <p className="text-slate-600 mt-0.5">Técnico: <strong className="font-medium text-slate-800">{m.tecnicoMatricula}</strong> | Turno {m.turno}</p>
            </div>
            <time className="text-slate-500 font-mono" dateTime={m.dataHora}>{formatDate(m.dataHora)}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
