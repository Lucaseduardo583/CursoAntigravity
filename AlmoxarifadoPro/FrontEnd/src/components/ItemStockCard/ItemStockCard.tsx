/**
 * Suposições adotadas:
 * - O cartão exibe medidor visual (barra de nível) comparando o saldo disponível com o estoque mínimo.
 * - Cores e contraste atendem rigorosamente o padrão WCAG 2.1 AA em tema escuro industrial.
 */

import { ItemBalance } from '../../types/inventory';

function calculateGaugePercent(current: number, min: number): number {
  if (min <= 0) return 100;
  return Math.min(100, Math.round((current / (min * 2)) * 100));
}

function StockStatusBadge({ isRupture }: { isRupture: boolean }) {
  if (isRupture) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        Crítico (Abaixo do Mínimo)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      Estoque Normal
    </span>
  );
}

function EmptyOrLoadingCard({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse text-slate-400 text-sm flex items-center justify-center gap-3">
        <span className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        Consultando saldo atualizado no PostgreSQL...
      </div>
    );
  }
  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-sm text-center">
      Informe ou selecione o código do material para inspecionar os níveis de inventário.
    </div>
  );
}

export function ItemStockCard({ item, isLoading }: { item: ItemBalance | null; isLoading: boolean }) {
  if (isLoading || !item) return <EmptyOrLoadingCard isLoading={isLoading} />;
  const percent = calculateGaugePercent(item.saldoAtual, item.saldoMinimo);

  return (
    <section aria-labelledby="stock-card-title" className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {item.categoria}
          </span>
          <h3 id="stock-card-title" className="text-xl font-bold text-white mt-1">{item.nome}</h3>
          <p className="text-xs font-mono text-cyan-400 mt-0.5">Código: {item.codigo}</p>
        </div>
        <StockStatusBadge isRupture={item.alertaRuptura} />
      </div>

      <div className="grid grid-cols-2 gap-4 py-5">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Saldo Disponível</span>
          <strong className={`text-4xl font-black ${item.alertaRuptura ? 'text-rose-400' : 'text-emerald-400'}`}>
            {item.saldoAtual}
          </strong>
          <span className="text-[11px] text-slate-500 block mt-1">unidades no almoxarifado</span>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Ponto de Reposição</span>
          <strong className="text-4xl font-black text-slate-300">{item.saldoMinimo}</strong>
          <span className="text-[11px] text-slate-500 block mt-1">limite mínimo de segurança</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Nível Operacional</span>
          <span className="font-mono">{percent}% do patamar seguro</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${item.alertaRuptura ? 'bg-gradient-to-r from-rose-600 to-amber-500' : 'bg-gradient-to-r from-blue-600 to-emerald-400'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
