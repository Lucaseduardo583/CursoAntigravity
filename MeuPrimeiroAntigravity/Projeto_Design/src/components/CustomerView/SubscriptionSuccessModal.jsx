import React from 'react';
import { 
  CheckCircle, 
  Truck, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  X,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function SubscriptionSuccessModal({ 
  order, 
  onClose, 
  onGoToCourierView 
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <Sparkles className="w-36 h-36" />
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                  Assinatura Confirmada!
                </span>
                <h3 className="font-serif font-black text-2xl text-white">
                  Bem-vindo à Horta-na-Mão 🌱
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-stone-500 text-xs block">Código da Assinatura:</span>
              <strong className="text-base font-mono text-emerald-900 font-black">
                {order.id}
              </strong>
            </div>
            <span className="bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-full">
              Ativa (Recorrente)
            </span>
          </div>

          <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-2 text-stone-700">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Plano: <strong>{order.planName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">
                Entrega: <strong>{order.address} ({order.neighborhood} - Zona Sul)</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Pagamento: <strong>Cartão Recorrente (R$ {order.price}/semana)</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Primeira Entrega Agendada: <strong>Próxima Segunda-feira, a partir das 07h</strong>
              </span>
            </div>
          </div>

          {/* Reminder about Sunday 23:59h deadline */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Lembrete da Regra de Colheita:</strong> A personalização e troca de itens da sua cesta semanal pode ser realizada sempre até <strong>domingo às 23:59h</strong>.
            </div>
          </div>

          {/* Direct CTA to Test Delivery View */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onGoToCourierView}
              className="w-full py-3.5 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer group"
            >
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Testar Agora na Visão do Entregador</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-100 transition"
            >
              Continuar navegando como Cliente
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
