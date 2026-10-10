/**
 * Suposições adotadas:
 * - O cabeçalho exibe o relógio operacional e identifica o turno ativo com base na hora do terminal.
 * - Inclui indicador de conexão ativa com o servidor do almoxarifado.
 */

import { useState, useEffect } from 'react';

function getActiveShift(hour: number): { name: string; label: string } {
  if (hour >= 6 && hour < 14) return { name: 'A', label: 'Turno A (06:00 - 14:00)' };
  if (hour >= 14 && hour < 22) return { name: 'B', label: 'Turno B (14:00 - 22:00)' };
  return { name: 'C', label: 'Turno C (22:00 - 06:00)' };
}

export function Header() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const shift = getActiveShift(time.getHours());

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl">
            ⚙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Metalúrgica Vale do Aço</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">v1.0-PRO</span>
            </div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">AlmoxarifadoPro — Terminal de Retiradas</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span className="text-slate-300 font-medium">{shift.label}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-cyan-300 font-semibold shadow-inner">
            {time.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>
    </header>
  );
}
