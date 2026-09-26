import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  FileImage,
  RefreshCw
} from 'lucide-react';
import { SIMULATED_DELIVERY_PHOTOS } from '../../data/mockData';

export default function DeliveryPhotoModal({ 
  order, 
  isOpen, 
  onClose, 
  onConfirmDelivery 
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoNote, setPhotoNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !order) return null;

  const currentDateStr = new Date().toLocaleDateString('pt-BR');
  const currentTimeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedPhoto({
          url: uploadEvent.target.result,
          title: file.name || 'Foto capturada pela câmera',
          timestamp: `${currentDateStr} às ${currentTimeStr}`,
          coords: `-22.9838, -43.2045 (${order.neighborhood} - Zona Sul)`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle preset simulated photos
  const handleSelectPreset = (preset) => {
    setSelectedPhoto({
      url: preset.url,
      title: preset.title,
      timestamp: `${currentDateStr} às ${currentTimeStr}`,
      coords: `-22.9838, -43.2045 (${order.neighborhood} - Zona Sul)`
    });
    if (!photoNote) {
      setPhotoNote(preset.note);
    }
  };

  const handleConfirm = () => {
    if (!selectedPhoto) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmDelivery(order.id, {
        photoUrl: selectedPhoto.url,
        photoTitle: selectedPhoto.title,
        timestamp: selectedPhoto.timestamp,
        coords: selectedPhoto.coords,
        note: photoNote || 'Cesta entregue e fotografada na porta do cliente em perfeitas condições.'
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-700/80 rounded-2xl">
              <Camera className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Comprovante de Logística
              </span>
              <h3 className="font-serif font-bold text-lg text-white">
                Foto da Cesta na Porta do Cliente
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-200 hover:text-white hover:bg-amber-700/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order mini banner */}
        <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
          <div>
            <span className="text-stone-500">Entrega: </span>
            <strong className="font-mono text-stone-900">{order.id}</strong> — {order.customerName}
          </div>
          <div className="font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            {order.neighborhood} (Zona Sul)
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
          
          {/* PHOTO SELECTION SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                Simular Captura / Upload da Foto:
              </label>
              <span className="text-[11px] text-stone-500">
                Selecione uma simulação ou faça upload
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {SIMULATED_DELIVERY_PHOTOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer relative overflow-hidden group ${
                    selectedPhoto?.url === preset.url
                      ? 'border-2 border-amber-700 bg-amber-50/60 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-16 object-cover rounded-xl"
                  />
                  <div className="min-w-0">
                    <span className="block font-bold text-[11px] text-stone-900 truncate">
                      {preset.type}
                    </span>
                    <span className="block text-[10px] text-stone-500 truncate">
                      {preset.note}
                    </span>
                  </div>
                  {selectedPhoto?.url === preset.url && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-700 text-white rounded-full p-0.5">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* File Upload Button / Camera trigger */}
            <div className="pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200/80 border border-dashed border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>Ou carregar/tirar foto real do dispositivo</span>
              </button>
            </div>
          </div>

          {/* PHOTO PREVIEW WITH WATERMARK OVERLAY */}
          {selectedPhoto ? (
            <div className="space-y-2">
              <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
                Pré-visualização com Metadados & Geolocalização:
              </span>
              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-800 shadow-lg bg-stone-900 aspect-video">
                <img
                  src={selectedPhoto.url}
                  alt="Cesta na porta"
                  className="w-full h-full object-cover"
                />

                {/* Digital Watermark Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-transparent p-3 text-white font-mono text-[10px] sm:text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>HORTA-NA-MÃO • COMPROVANTE DIGITAL</span>
                    <span>PEDIDO #{order.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-200">
                    <Clock className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>Data/Hora: {selectedPhoto.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-200">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">GPS: {selectedPhoto.coords}</span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Foto Validada
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-stone-300 rounded-2xl text-center bg-stone-50/50 space-y-2">
              <Camera className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-600 font-medium">
                Nenhuma foto selecionada ainda.
              </p>
              <p className="text-[11px] text-stone-400">
                Selecione um dos exemplos acima ou use o botão para capturar a foto da cesta na porta do cliente.
              </p>
            </div>
          )}

          {/* Delivery Note */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Observação do Entregador (Opcional):
            </label>
            <input
              type="text"
              placeholder="Ex: Deixado na porta 302 conforme instrução do cliente."
              value={photoNote}
              onChange={(e) => setPhotoNote(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-700 outline-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!selectedPhoto || isSubmitting}
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              selectedPhoto && !isSubmitting
                ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-md'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Confirmando Entrega...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-amber-200" />
                <span>Confirmar Entrega com Foto</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
