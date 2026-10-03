import React, { useState } from 'react';
import { 
  Truck, 
  Camera, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  AlertCircle, 
  Navigation, 
  Eye, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import DeliveryPhotoModal from './DeliveryPhotoModal';

export default function CourierDashboard({ 
  deliveries, 
  onConfirmDelivery, 
  onUpdateDeliveryStatus 
}) {
  const [selectedOrderForPhoto, setSelectedOrderForPhoto] = useState(null);
  const [viewProofModal, setViewProofModal] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'delivered'

  const filteredDeliveries = deliveries.filter(d => {
    if (filter === 'pending') return d.status !== 'delivered';
    if (filter === 'delivered') return d.status === 'delivered';
    return true;
  });

  const pendingCount = deliveries.filter(d => d.status !== 'delivered').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Truck className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Módulo de Logística & Entregas
              </span>
              <span className="text-stone-400 text-xs">Rota da Manhã</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              Painel do Entregador
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Confirme a entrega das cestas orgânicas colhidas na madrugada diretamente na porta dos clientes da <strong>Zona Sul</strong> com registro fotográfico e geolocalização.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 text-center min-w-[100px]">
              <span className="text-2xl font-black text-amber-400 block">
                {pendingCount}
              </span>
              <span className="text-[11px] text-stone-400 font-medium">Pendentes</span>
            </div>
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 text-center min-w-[100px]">
              <span className="text-2xl font-black text-emerald-400 block">
                {deliveredCount}
              </span>
              <span className="text-[11px] text-stone-400 font-medium">Entregues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Todas as Entregas ({deliveries.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'delivered'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Entregues com Foto ({deliveredCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Área Exclusiva: <strong>Zona Sul</strong></span>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDeliveries.map((delivery) => {
          const isDelivered = delivery.status === 'delivered';
          const isInRoute = delivery.status === 'in_route';

          return (
            <div
              key={delivery.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                isDelivered
                  ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                  : isInRoute
                    ? 'bg-white border-2 border-amber-600 shadow-md ring-2 ring-amber-500/10'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div className="space-y-4">
                
                {/* Delivery Header */}
                <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-500">
                        #{delivery.id}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        {delivery.createdAt}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
                      {delivery.customerName}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> Entregue
                      </span>
                    ) : isInRoute ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                        <Navigation className="w-3.5 h-3.5 text-amber-700" /> Em Rota
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 border border-stone-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-stone-500" /> Aguardando Saída
                      </span>
                    )}
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        {delivery.address}
                      </span>
                      <span className="inline-block bg-emerald-100/80 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 border border-emerald-200">
                        {delivery.neighborhood} • Zona Sul
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>WhatsApp: <strong>{delivery.customerPhone}</strong></span>
                  </div>

                  {delivery.notes && (
                    <div className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl text-stone-700 text-[11px]">
                      <span className="font-bold text-amber-900">Instruções do cliente: </span>
                      {delivery.notes}
                    </div>
                  )}
                </div>

                {/* Plan Info */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs">
                  <span className="font-bold text-stone-700 block mb-1">
                    Cesta a Entregar:
                  </span>
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="font-medium text-emerald-800">{delivery.planName}</span>
                    <span className="text-[11px] text-stone-400">{delivery.recurringBilling}</span>
                  </div>
                </div>

                {/* If already delivered, show proof preview */}
                {isDelivered && delivery.proofPhoto && (
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center gap-3">
                    <img
                      src={delivery.proofPhoto.photoUrl}
                      alt="Comprovante"
                      className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div className="text-xs min-w-0 flex-1">
                      <span className="font-bold text-emerald-900 block truncate">
                        ✓ Comprovante com Foto Validado
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {delivery.deliveredAt || delivery.proofPhoto.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewProofModal(delivery)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline mt-0.5 cursor-pointer"
                      >
                        Ver Foto e Metadados
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Delivery Actions */}
              <div className="pt-5 mt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-2">
                {!isDelivered ? (
                  <>
                    {!isInRoute && (
                      <button
                        type="button"
                        onClick={() => onUpdateDeliveryStatus(delivery.id, 'in_route')}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-stone-500" />
                        <span>Iniciar Rota</span>
                      </button>
                    )}

                    {/* CORE REQUIREMENT: BUTTON TO SIMULATE UPLOAD/PHOTO CAPTURE OF BASKET AT CUSTOMER'S DOOR */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForPhoto(delivery)}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-950/20 transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-200" />
                      <span>📸 Tirar / Simular Foto na Porta</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setViewProofModal(delivery)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-emerald-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar Comprovante da Entrega</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
          <Truck className="w-10 h-10 text-stone-300 mx-auto" />
          <h4 className="font-serif font-bold text-stone-700 text-base">
            Nenhuma entrega encontrada nesta categoria.
          </h4>
          <p className="text-xs text-stone-500">
            Mude o filtro acima ou realize uma nova assinatura na Visão do Cliente para gerar uma entrega.
          </p>
        </div>
      )}

      {/* MODAL DE SIMULAÇÃO DE FOTO DA CESTA NA PORTA */}
      <DeliveryPhotoModal
        order={selectedOrderForPhoto}
        isOpen={!!selectedOrderForPhoto}
        onClose={() => setSelectedOrderForPhoto(null)}
        onConfirmDelivery={onConfirmDelivery}
      />

      {/* MODAL DE VISUALIZAÇÃO DO COMPROVANTE ENTREGUE */}
      {viewProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Comprovante Digital de Entrega
                </span>
                <h4 className="font-serif font-bold text-lg text-stone-900">
                  Pedido #{viewProofModal.id} — Entregue
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setViewProofModal(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {viewProofModal.proofPhoto ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md">
                  <img
                    src={viewProofModal.proofPhoto.photoUrl}
                    alt="Foto da Cesta na Porta"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-stone-950/80 p-3 text-white text-[11px] font-mono space-y-0.5">
                    <div className="text-emerald-300 font-bold">
                      HORTA-NA-MÃO • COMPROVANTE GEORREFERENCIADO
                    </div>
                    <div>Horário: {viewProofModal.proofPhoto.timestamp}</div>
                    <div className="text-stone-300 truncate">GPS: {viewProofModal.proofPhoto.coords}</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <p><strong>Destinatário:</strong> {viewProofModal.customerName}</p>
                  <p><strong>Endereço:</strong> {viewProofModal.address} ({viewProofModal.neighborhood})</p>
                  <p><strong>Observação registrada:</strong> {viewProofModal.proofPhoto.note}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">Sem foto registrada.</p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewProofModal(null)}
                className="px-4 py-2 bg-stone-800 text-white text-xs font-semibold rounded-xl hover:bg-stone-700 transition"
              >
                Fechar Comprovante
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
