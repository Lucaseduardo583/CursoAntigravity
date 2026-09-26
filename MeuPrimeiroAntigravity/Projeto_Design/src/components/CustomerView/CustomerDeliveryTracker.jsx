import React, { useState } from 'react';
import { 
  PackageCheck, 
  Truck, 
  MapPin, 
  Camera, 
  Eye, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function CustomerDeliveryTracker({ orders, onOpenProofModal }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!orders || orders.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-800/40 space-y-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/30 border border-emerald-400/30 rounded-2xl text-emerald-300">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Suas Assinaturas & Entregas Ativas
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {orders.length} ativa{orders.length > 1 ? 's' : ''}
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              Status da Cesta em Tempo Real
            </h3>
          </div>
        </div>

        <button 
          type="button"
          className="text-stone-400 hover:text-white p-1 rounded-lg transition"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2">
          {orders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isInRoute = order.status === 'in_route';

            return (
              <div 
                key={order.id}
                className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      #{order.id}
                    </span>
                    <span className="text-xs text-stone-300 font-medium">
                      {order.planName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{order.address} ({order.neighborhood} - Zona Sul)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  {isDelivered ? (
                    <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/60 text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Cesta Entregue na Porta!</span>
                    </div>
                  ) : isInRoute ? (
                    <div className="flex items-center gap-2 bg-amber-900/60 border border-amber-500/60 text-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <Truck className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Entregador em Rota</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-stone-700/60 border border-stone-600 text-stone-300 px-3 py-1.5 rounded-xl text-xs font-medium">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>Colheita Agendada</span>
                    </div>
                  )}

                  {/* If delivered and has proof photo, customer can view photo! */}
                  {isDelivered && order.proofPhoto && (
                    <button
                      type="button"
                      onClick={() => onOpenProofModal(order)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Foto na Porta</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
