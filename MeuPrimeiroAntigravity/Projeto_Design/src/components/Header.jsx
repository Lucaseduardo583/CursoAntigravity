import React from 'react';
import { 
  Sprout, 
  User, 
  Truck, 
  Clock, 
  Lock, 
  Unlock, 
  MapPin, 
  Sparkles,
  Leaf
} from 'lucide-react';

export default function Header({ 
  activeView, 
  setActiveView, 
  isSundayLocked, 
  setIsSundayLocked,
  pendingDeliveriesCount 
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Testing & Simulation Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-stone-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-stone-100 uppercase tracking-wider text-[11px]">
            Painel de Simulação das Regras de Negócio:
          </span>
        </div>

        {/* Rule 1: Domingo 23:59h Simulation Switch */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-stone-800/90 px-2.5 py-1 rounded-lg border border-stone-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-stone-300">Regra de Troca de Itens:</span>
            <button
              onClick={() => setIsSundayLocked(!isSundayLocked)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                isSundayLocked
                  ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                  : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
              }`}
              title="Clique para alternar a simulação do horário de bloqueio da cesta"
            >
              {isSundayLocked ? (
                <>
                  <Lock className="w-3 h-3 text-rose-300" />
                  <span>Após Domingo 23:59h (Bloqueado)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 text-emerald-300" />
                  <span>Antes de Domingo 23:59h (Liberado)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Info Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-stone-400 text-[11px]">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>Região Restrita: <strong>Exclusivo Zona Sul</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-stone-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 border border-emerald-600/30">
              <Sprout className="w-6 h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-2xl tracking-tight text-stone-900">
                  Horta<span className="text-emerald-700">-na-Mão</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <Leaf className="w-2.5 h-2.5 text-emerald-700" /> 100% Orgânico
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Assinatura semanal de cestas direto da terra para sua mesa
              </p>
            </div>
          </div>

          {/* Dual View Selector Tabs (Visão do Cliente x Visão do Entregador) */}
          <div className="flex items-center bg-stone-200/80 p-1.5 rounded-2xl border border-stone-300/80 shadow-inner">
            {/* Cliente */}
            <button
              onClick={() => setActiveView('customer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeView === 'customer'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Visão do Cliente</span>
              <span className="hidden md:inline-block text-[11px] opacity-80 font-normal">
                (Escolha & Pagamento)
              </span>
            </button>

            {/* Entregador */}
            <button
              onClick={() => setActiveView('courier')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer relative ${
                activeView === 'courier'
                  ? 'bg-amber-800 text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/60'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>2. Visão do Entregador</span>
              {pendingDeliveriesCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold rounded-full bg-rose-500 text-white shadow-xs animate-bounce">
                  {pendingDeliveriesCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
