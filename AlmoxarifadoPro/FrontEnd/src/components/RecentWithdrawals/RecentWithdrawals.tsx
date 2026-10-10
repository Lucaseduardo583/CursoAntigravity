/**
 * Suposições adotadas:
 * - Exibe lista em tempo real com as retiradas efetuadas pelo operador no terminal.
 * - Inclui formatação de hora, turno e quantidade com contraste estrito e tema industrial.
 */

import { WithdrawalResponse } from '../../types/inventory';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return iso;
  }
}

function WithdrawalItemRow({ movement }: { movement: WithdrawalResponse }) {
  return (
    <li className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center font-mono">
          #{movement.id}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white text-sm">{movement.itemCodigo}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-900/50 text-cyan-300 border border-blue-700/50">
              -{movement.quantidade} un
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Técnico: <strong className="text-slate-200 font-semibold">{movement.tecnicoMatricula}</strong> · <span className="text-cyan-400 font-semibold">Turno {movement.turno}</span>
          </p>
        </div>
      </div>
      <time className="text-[11px] font-mono text-slate-500 whitespace-nowrap" dateTime={movement.dataHora}>
        {formatTime(movement.dataHora)}
      </time>
    </li>
  );
}

export function RecentWithdrawals({ movements }: { movements: WithdrawalResponse[] }) {
  if (movements.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs text-center">
        Nenhuma retirada efetuada nesta sessão do terminal.
      </div>
    );
  }

  return (
    <section aria-labelledby="history-title" className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h3 id="history-title" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>📋</span> Histórico da Sessão ({movements.length})
        </h3>
        <span className="text-[10px] text-emerald-400 font-medium">● Gravado no PostgreSQL</span>
      </div>
      <ul className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto" role="list">
        {movements.map((m) => (
          <WithdrawalItemRow key={m.id} movement={m} />
        ))}
      </ul>
    </section>
  );
}
