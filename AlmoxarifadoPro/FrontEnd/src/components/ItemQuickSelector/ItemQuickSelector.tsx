/**
 * Suposições adotadas:
 * - Oferece atalhos visuais para os itens de maior rotatividade no chão de fábrica.
 * - Ao clicar no atalho, o código é selecionado e a busca de saldo é disparada automaticamente.
 */

interface QuickItem {
  code: string;
  name: string;
  category: string;
  icon: string;
}

const FREQUENT_ITEMS: QuickItem[] = [
  { code: 'BRO-0042', name: 'Broca Diamantada 12mm', category: 'Ferramental', icon: '🔩' },
  { code: 'EPI-1001', name: 'Óculos de Proteção Incolor', category: 'EPI', icon: '🥽' },
  { code: 'EPI-1002', name: 'Luva de Vaqueta Curta', category: 'EPI', icon: '🧤' },
  { code: 'ROL-2030', name: 'Rolamento 6204', category: 'Rolamentos', icon: '⚙' },
  { code: 'DIS-3001', name: 'Disco de Corte Inox 4.1/2', category: 'Abrasivos', icon: '💿' },
];

export function ItemQuickSelector({ selectedCode, onSelect }: { selectedCode: string; onSelect: (code: string) => void }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Itens de Alta Rotatividade (Acesso Rápido)</label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {FREQUENT_ITEMS.map((item) => {
          const isSelected = selectedCode.toUpperCase() === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => onSelect(item.code)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-base mb-1">
                <span>{item.icon}</span>
                <span className="text-[10px] font-mono font-bold text-slate-400">{item.code}</span>
              </div>
              <span className="text-xs font-medium text-slate-200 line-clamp-1">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
