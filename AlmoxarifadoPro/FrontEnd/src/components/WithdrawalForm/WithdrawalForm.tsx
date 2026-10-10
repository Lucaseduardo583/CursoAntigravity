/**
 * Suposições adotadas:
 * - O formulário inclui botões de incremento rápido (+1, +2, +5) para facilitar o uso por terminais touch ou teclado.
 * - Os turnos são selecionáveis via botões segmentados com indicação de horário operacional.
 */

import type { FormEvent } from 'react';
import { Shift, FormErrors } from '../../types/inventory';

interface FormProps {
  itemCode: string;
  onItemCodeChange: (value: string) => void;
  onItemBlur: () => void;
  quantity: number;
  onQuantityChange: (value: number) => void;
  technicianBadge: string;
  onTechnicianBadgeChange: (value: string) => void;
  shift: Shift;
  onShiftChange: (value: Shift) => void;
  errors: FormErrors;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
}

function ItemCodeInput({ value, onChange, onBlur, error }: { value: string; onChange: (v: string) => void; onBlur: () => void; error?: string }) {
  return (
    <div>
      <label htmlFor="item-code" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Código do Material *</label>
      <div className="relative">
        <input
          id="item-code"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'item-code-err' : undefined}
          placeholder="Ex: BRO-0042, EPI-1001..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 font-mono text-sm uppercase text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
          required
        />
        <span className="absolute right-3.5 top-3.5 text-xs text-slate-500 font-mono select-none">TAB p/ buscar</span>
      </div>
      {error && <p id="item-code-err" className="mt-1.5 text-xs font-semibold text-rose-400">{error}</p>}
    </div>
  );
}

function QuantityStepper({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  const increments = [1, 2, 5, 10];
  return (
    <div>
      <label htmlFor="qty-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Quantidade a Retirar *</label>
      <div className="flex gap-2 mb-2">
        <input
          id="qty-input"
          type="number"
          min="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'qty-err' : undefined}
          className="w-28 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-base font-bold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <div className="flex items-center gap-1.5 flex-1">
          {increments.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              className="flex-1 py-2 px-2 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            >
              {step}
            </button>
          ))}
        </div>
      </div>
      {error && <p id="qty-err" className="mt-1 text-xs font-semibold text-rose-400">{error}</p>}
    </div>
  );
}

function ShiftSelector({ value, onChange }: { value: Shift; onChange: (v: Shift) => void }) {
  const shifts: { key: Shift; label: string; time: string }[] = [
    { key: 'A', label: 'Turno A', time: '06h - 14h' },
    { key: 'B', label: 'Turno B', time: '14h - 22h' },
    { key: 'C', label: 'Turno C', time: '22h - 06h' },
  ];
  return (
    <div>
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Turno de Produção *</label>
      <div className="grid grid-cols-3 gap-2">
        {shifts.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={`py-2 px-3 rounded-xl border text-center transition-all ${
              value === s.key
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <div className="font-bold text-xs">{s.label}</div>
            <div className="text-[10px] opacity-75">{s.time}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BadgeInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <label htmlFor="badge-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Matrícula do Técnico / Operador *</label>
      <input
        id="badge-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'badge-err' : undefined}
        placeholder="Ex: T-10931"
        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 font-mono text-sm uppercase text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        required
      />
      {error && <p id="badge-err" className="mt-1.5 text-xs font-semibold text-rose-400">{error}</p>}
    </div>
  );
}

function FormButtons({ isSubmitting, onReset }: { isSubmitting: boolean; onReset: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Registrando Transação...' : '✔ Confirmar Retirada'}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
        className="py-3.5 px-5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-semibold text-sm transition-colors"
      >
        Limpar
      </button>
    </div>
  );
}

export function WithdrawalForm(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit} noValidate aria-label="Formulário de Retirada" className="space-y-4">
      <ItemCodeInput value={props.itemCode} onChange={props.onItemCodeChange} onBlur={props.onItemBlur} error={props.errors.itemCode} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuantityStepper value={props.quantity} onChange={props.onQuantityChange} error={props.errors.quantity} />
        <ShiftSelector value={props.shift} onChange={props.onShiftChange} />
      </div>
      <BadgeInput value={props.technicianBadge} onChange={props.onTechnicianBadgeChange} error={props.errors.technicianBadge} />
      <FormButtons isSubmitting={props.isSubmitting} onReset={props.onReset} />
    </form>
  );
}
