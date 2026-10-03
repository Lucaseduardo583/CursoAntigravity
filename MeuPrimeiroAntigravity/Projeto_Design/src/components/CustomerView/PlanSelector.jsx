import React from 'react';
import { Check, Star, Sparkles, Scale, ShoppingBag, ShieldCheck } from 'lucide-react';
import { PLANS } from '../../data/mockData';

export default function PlanSelector({ selectedPlanId, onSelectPlan }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> Passo 1 de 3
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Escolha seu Plano de Assinatura
          </h2>
          <p className="text-sm text-stone-600">
            Cestas colhidas na madrugada da entrega. Cancele ou pause quando desejar.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sem taxa de adesão ou carência</span>
        </div>
      </div>

      {/* 3 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-emerald-700 shadow-xl ring-4 ring-emerald-600/10 -translate-y-1'
                  : 'bg-white/80 border border-stone-200 hover:border-stone-400 hover:shadow-md'
              }`}
            >
              {/* Highlight ribbon if Plano Médio */}
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md tracking-wide uppercase">
                    <Star className="w-3 h-3 fill-amber-200 text-amber-200" /> Mais Escolhido
                  </span>
                </div>
              )}

              <div>
                {/* Header of Card */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      {plan.tier}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-stone-900">
                      {plan.name}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${plan.badgeColor}`}>
                    {plan.tag}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-4 min-h-[34px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="py-4 my-2 border-y border-stone-100 flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-stone-500">R$</span>
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">/ semana</span>
                </div>

                {/* Weight badge */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-4 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                  <Scale className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{plan.weight}</span>
                </div>

                {/* Items included preview */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Contém na cesta:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {plan.items.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          <strong>{item.qty}</strong> {item.name}
                        </span>
                      </li>
                    ))}
                    {plan.items.length > 4 && (
                      <li className="text-[11px] text-emerald-700 font-semibold pl-5">
                        + {plan.items.length - 4} outros itens da estação
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Selection Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlan(plan.id);
                }}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" /> Plano Selecionado
                  </>
                ) : (
                  'Selecionar este Plano'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
