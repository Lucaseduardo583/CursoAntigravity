import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building, 
  Home, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { validateZonaSulNeighborhood, ZONA_SUL_NEIGHBORHOODS, INVALID_TEST_NEIGHBORHOODS } from '../../data/mockData';

export default function DeliveryAddressForm({ 
  formData, 
  setFormData, 
  validationResult,
  onOpenNeighborhoodsModal 
}) {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBairroQuickSelect = (bairroName) => {
    handleInputChange('bairro', bairroName);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Passo 3 de 3 (Parte A)
          </span>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
            Endereço de Entrega & Validação Regional
          </h3>
          <p className="text-xs text-stone-500">
            Informe onde você deseja receber sua cesta de orgânicos toda semana.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNeighborhoodsModal}
          className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Ver Bairros da Zona Sul Atendidos</span>
        </button>
      </div>

      {/* QUICK TESTING BAR FOR EVALUATION */}
      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold text-stone-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Atalhos para testar a validação do Bairro:
          </span>
          <span className="text-[11px] text-stone-500">Clique para preencher instantaneamente</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] font-semibold text-emerald-800 self-center mr-1">Válidos (Zona Sul):</span>
          {['Copacabana', 'Ipanema', 'Leblon', 'Botafogo', 'Moema'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => handleBairroQuickSelect(b)}
              className="px-2.5 py-1 bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200 rounded-lg text-[11px] font-medium border border-emerald-300 transition cursor-pointer"
            >
              ✓ {b}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-rose-800 self-center mr-1">Inválidos (Bloqueia):</span>
          {['Tijuca', 'Barra da Tijuca', 'Centro', 'Pinheiros'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => handleBairroQuickSelect(b)}
              className="px-2.5 py-1 bg-rose-100/80 text-rose-900 hover:bg-rose-200 rounded-lg text-[11px] font-medium border border-rose-300 transition cursor-pointer"
            >
              ✗ {b}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Nome */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Nome Completo do Assinante *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Ana Clara Silva"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            WhatsApp para Notificação de Entrega *
          </label>
          <input
            type="tel"
            required
            placeholder="(21) 98765-4321"
            value={formData.telefone}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
          />
        </div>

        {/* BAIRRO FIELD (CORE BUSINESS RULE: VALIDATION OF ZONA SUL) */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-stone-700">
              Bairro de Entrega * <span className="text-emerald-700 font-semibold">(Obrigatório Zona Sul)</span>
            </label>
            <span className="text-[11px] text-stone-500">
              Digite ou selecione acima
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              placeholder="Ex: Copacabana, Ipanema, Botafogo, Moema..."
              value={formData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              className={`w-full pl-3.5 pr-10 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                formData.bairro.trim() === ''
                  ? 'bg-stone-50 border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700'
                  : validationResult.isValid
                    ? 'bg-emerald-50/50 border-2 border-emerald-600 text-emerald-950 focus:ring-2 focus:ring-emerald-500'
                    : 'bg-rose-50/60 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400'
              }`}
            />

            <div className="absolute right-3.5 top-3.5">
              {formData.bairro.trim() !== '' && (
                validationResult.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 animate-pulse" />
                )
              )}
            </div>
          </div>

          {/* REAL-TIME VALIDATION BANNER FOR BAIRRO */}
          {formData.bairro.trim() !== '' && (
            <div className="mt-2.5">
              {validationResult.isValid ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold">Região Atendida!</span> {validationResult.message}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-rose-800">
                      🚫 Bloqueio de Cadastro: Região Não Atendida
                    </p>
                    <p className="leading-relaxed">
                      {validationResult.reason}
                    </p>
                    <p className="text-[11px] text-rose-700 font-medium pt-0.5">
                      Para continuar a assinatura, o endereço informado deve obrigatoriamente estar localizado na <strong>Zona Sul</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logradouro (Rua / Av) */}
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Rua / Avenida *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Rua Barão da Torre"
            value={formData.rua}
            onChange={(e) => handleInputChange('rua', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        {/* Número e Complemento */}
        <div className="grid grid-cols-2 gap-2 md:col-span-1">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Número *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 340"
              value={formData.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Complemento
            </label>
            <input
              type="text"
              placeholder="Apto 501"
              value={formData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        {/* Observações de Entrega */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Instruções para o Entregador
          </label>
          <input
            type="text"
            placeholder="Ex: Portaria 24h, tocar o interfone 501 ou deixar com o porteiro."
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

      </div>

    </section>
  );
}
