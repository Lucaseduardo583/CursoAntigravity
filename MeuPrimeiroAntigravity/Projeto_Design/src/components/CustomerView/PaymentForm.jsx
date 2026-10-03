import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  RefreshCcw, 
  AlertTriangle, 
  Check, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';

export default function PaymentForm({ 
  plan, 
  isAddressValid, 
  addressError, 
  onSubmitPayment,
  isProcessing 
}) {
  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    cpf: '',
    expiry: '',
    cvv: ''
  });

  const [cardBrand, setCardBrand] = useState('generic'); // 'visa', 'mastercard', 'elo', 'generic'

  // Detect card brand & format card number
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    
    // detect brand
    if (value.startsWith('4')) {
      setCardBrand('visa');
    } else if (/^5[1-5]/.test(value) || /^2[2-7]/.test(value)) {
      setCardBrand('mastercard');
    } else if (/^(4011|4389|4514|5041|5066|5067|6277|6362|6363)/.test(value)) {
      setCardBrand('elo');
    } else {
      setCardBrand('generic');
    }

    // format 0000 0000 0000 0000
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData(prev => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardData(prev => ({ ...prev, expiry: value }));
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);
    // format 000.000.000-00
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCardData(prev => ({ ...prev, cpf: value }));
  };

  // Helper to fill sample test card
  const handleFillTestCard = () => {
    setCardBrand('mastercard');
    setCardData({
      number: '5502 8410 9321 4488',
      holderName: 'LUCAS E SILVA',
      cpf: '321.654.987-00',
      expiry: '10/29',
      cvv: '842'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAddressValid) return;
    onSubmitPayment(cardData);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Passo 3 de 3 (Parte B)
          </span>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
            Pagamento Recorrente
          </h3>
          <p className="text-xs text-stone-500">
            Assinatura semanal com renovação automática e cancelamento livre.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillTestCard}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Preencher Cartão de Teste</span>
        </button>
      </div>

      {/* STRICT RESTRICTION BADGE (ONLY CREDIT CARD ALLOWED) */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-300/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-emerald-700 text-white rounded-xl shrink-0 mt-0.5">
          <RefreshCcw className="w-4 h-4" />
        </div>
        <div className="text-xs text-emerald-950 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-emerald-900">
              Método Exclusivo: Cartão de Crédito Recorrente
            </span>
            <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Assinatura Semanal
            </span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Para garantir a estabilidade do fluxo de colheita dos produtores rurais sem risco de interrupção, aceitamos exclusivamente <strong>Cartão de Crédito com Débito Recorrente</strong>. Sem intermediários, sem faturas avulsas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] aspect-[1.586] rounded-2xl p-5 bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-emerald-700/30">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#52b788_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

            {/* Top row */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black tracking-wider text-sm text-emerald-300">
                  Horta-na-Mão
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono">Assinatura</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold tracking-wider text-stone-200 uppercase font-mono">
                  {cardBrand === 'visa' && 'VISA'}
                  {cardBrand === 'mastercard' && 'MASTERCARD'}
                  {cardBrand === 'elo' && 'ELO'}
                  {cardBrand === 'generic' && 'CARTÃO'}
                </span>
              </div>
            </div>

            {/* Chip & Contactless */}
            <div className="flex items-center gap-3 z-10 my-1">
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner flex items-center justify-center">
                <div className="w-7 h-5 border border-amber-800/40 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-amber-300/30"></div>
                  <div className="bg-amber-300/30"></div>
                  <div className="bg-amber-300/30"></div>
                  <div className="bg-amber-300/30"></div>
                </div>
              </div>
              <div className="w-4 h-4 text-emerald-400/70 rotate-90">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                  <path d="M12 19a9 9 0 0 1 0-14" />
                </svg>
              </div>
            </div>

            {/* Card Number */}
            <div className="z-10 tracking-widest font-mono text-base sm:text-lg text-emerald-100 font-semibold drop-shadow-xs">
              {cardData.number || '•••• •••• •••• ••••'}
            </div>

            {/* Footer row */}
            <div className="flex justify-between items-end z-10 text-[10px] uppercase font-mono">
              <div>
                <span className="text-stone-400 block text-[8px]">Titular</span>
                <span className="font-semibold tracking-wider text-stone-100 truncate max-w-[150px] block">
                  {cardData.holderName || 'NOME NO CARTÃO'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block text-[8px]">Validade</span>
                <span className="font-semibold text-stone-100">
                  {cardData.expiry || 'MM/AA'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-stone-400 text-xs">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-700" /> Criptografia 256 bits
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> PCI-DSS Nível 1
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Card Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Número do Cartão de Crédito *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  value={cardData.number}
                  onChange={handleCardNumberChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-700 outline-none"
                />
                <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Holder Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Nome Impresso no Cartão *
              </label>
              <input
                type="text"
                required
                placeholder="Como gravado no plástico"
                value={cardData.holderName}
                onChange={(e) => setCardData(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm uppercase focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            {/* CPF, Expiry, CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  CPF do Titular *
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cardData.cpf}
                  onChange={handleCpfChange}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Validade (MM/AA) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/AA"
                  value={cardData.expiry}
                  onChange={handleExpiryChange}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-center focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Código CVV *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-center focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>

            {/* Subscription Summary */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span>Plano selecionado:</span>
                <span className="font-bold text-stone-900">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Cobrança recorrente:</span>
                <span className="font-semibold text-emerald-800">Toda Segunda-feira</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Taxa de Entrega (Zona Sul):</span>
                <span className="font-bold text-emerald-700">GRÁTIS</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-sm font-bold text-stone-900">
                <span>Total a debitar semanalmente:</span>
                <span className="text-emerald-800 text-lg">R$ {plan.price},00</span>
              </div>
            </div>

            {/* BLOCK CHECKOUT IF ADDRESS IS NOT IN ZONA SUL */}
            {!isAddressValid && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-rose-800 mb-0.5">
                    Assinatura Bloqueada por Região
                  </strong>
                  <span>
                    O botão de assinatura permanecerá bloqueado enquanto o endereço não for validado como pertencente à <strong>Zona Sul</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isAddressValid || isProcessing}
              className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
                isAddressValid && !isProcessing
                  ? 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-emerald-900/20 hover:shadow-emerald-900/30 -translate-y-0.5 active:translate-y-0'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  <span>Validando e Processando Assinatura...</span>
                </>
              ) : isAddressValid ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Confirmar Assinatura Recorrente (R$ {plan.price}/sem)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Corrija o Bairro para Liberar o Pagamento</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-stone-500 leading-tight">
              Ao assinar, você concorda com o débito semanal automático no cartão de crédito cadastrado. Você pode pausar ou cancelar a assinatura a qualquer momento com apenas 1 clique no painel.
            </p>

          </form>
        </div>

      </div>

    </section>
  );
}
