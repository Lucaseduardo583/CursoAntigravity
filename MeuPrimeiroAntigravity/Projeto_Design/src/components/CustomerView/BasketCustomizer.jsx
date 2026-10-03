import React, { useState } from 'react';
import { 
  AlertCircle, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Check, 
  Clock, 
  Calendar, 
  Leaf, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

export default function BasketCustomizer({ 
  plan, 
  customizedItems, 
  onSwapItem, 
  onResetItems,
  isSundayLocked, 
  setIsSundayLocked 
}) {
  const [activeSwapItem, setActiveSwapItem] = useState(null);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Passo 2 de 3
            </span>
            <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
              Itens da Semana
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
            Personalização da Cesta: {plan.name}
          </h3>
        </div>

        {/* Quick simulator shortcut toggle */}
        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-2xl">
          <span className="text-xs text-stone-500 font-medium">Simular Prazo:</span>
          <button
            type="button"
            onClick={() => setIsSundayLocked(!isSundayLocked)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              isSundayLocked
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {isSundayLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-700" />
                <span>Após Domingo 23:59h</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Antes de Domingo 23:59h</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* REGRA DE NEGÓCIO: AVISO PROEMINENTE DE DOMINGO ÀS 23:59H */}
      <div 
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
          isSundayLocked
            ? 'bg-rose-50/90 border-rose-300 text-rose-900'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        }`}
      >
        <div className={`p-2 rounded-xl shrink-0 ${
          isSundayLocked ? 'bg-rose-200/80 text-rose-800' : 'bg-amber-200/80 text-amber-900'
        }`}>
          {isSundayLocked ? <Lock className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
        </div>
        <div className="space-y-1 text-xs sm:text-sm flex-1">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="font-bold text-base tracking-tight flex items-center gap-1.5">
              {isSundayLocked ? (
                <span className="text-rose-900">🔒 Personalização de Itens Bloqueada</span>
              ) : (
                <span className="text-amber-950">⚠️ Regra de Negócio: Prazo Limite de Domingo às 23:59h</span>
              )}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isSundayLocked ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-950'
            }`}>
              {isSundayLocked ? 'Prazo Expirado' : 'Edição Permitida'}
            </span>
          </div>

          <p className="leading-relaxed">
            {isSundayLocked ? (
              <span>
                <strong>Atenção: A troca de itens da cesta só é permitida até domingo às 23:59h.</strong> Como o prazo expirou, as ordens de colheita foram fechadas e repassadas aos agricultores familiares parceiros. Os itens desta semana foram fixados para evitar desperdício de alimentos.
              </span>
            ) : (
              <span>
                <strong>Atenção: A troca de itens da cesta só é permitida até domingo às 23:59h.</strong> Na madrugada de segunda-feira, os agricultores colhem exclusivamente os itens confirmados para garantir que cheguem super frescos.
              </span>
            )}
          </p>

          {!isSundayLocked && (
            <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Calendar className="w-3.5 h-3.5" />
              <span>Prazo aberto para a cesta desta semana: Encerra no próximo Domingo às 23:59h</span>
            </div>
          )}
        </div>
      </div>

      {/* Basket Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Itens inclusos na sua cesta ({customizedItems.length} itens)
          </span>
          {!isSundayLocked && (
            <button
              type="button"
              onClick={onResetItems}
              className="text-xs text-stone-500 hover:text-emerald-700 font-medium flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" /> Restaurar cesta padrão
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {customizedItems.map((item, index) => (
            <div
              key={item.id || index}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isSundayLocked
                  ? 'bg-stone-50/70 border-stone-200 opacity-90'
                  : 'bg-[#FAF8F5] border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    <strong className="text-emerald-800">{item.qty}</strong> • {item.category}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {isSundayLocked ? (
                <div 
                  className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-stone-400 bg-stone-200/60 px-2 py-1 rounded-lg"
                  title="Troca bloqueada após Domingo 23:59h"
                >
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span className="hidden sm:inline">Fixado</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveSwapItem(item)}
                  className="shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Substituir</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Swap Modal (only if not locked) */}
      {activeSwapItem && !isSundayLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-stone-900">
                  Substituir Item da Cesta
                </h4>
                <p className="text-xs text-stone-500">
                  Item atual: <strong>{activeSwapItem.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSwapItem(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Escolha uma opção colhida pelos mesmos produtores agroecológicos para trocar sem custo adicional:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {plan.swappableOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSwapItem(activeSwapItem.id, opt);
                    setActiveSwapItem(null);
                  }}
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/60 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                      {opt.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Quantidade: {opt.qty} • {opt.category}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSwapItem(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200/60 rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
