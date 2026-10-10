/**
 * Suposições adotadas:
 * - O formulário valida campos no cliente e dispara busca de saldo ao perder foco (onBlur) do código.
 * - Atributos ARIA (aria-invalid, aria-describedby) garantem conformidade com WCAG 2.1 AA.
 */

import React from 'react';
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
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

function ItemCodeInput({ value, onChange, onBlur, error }: { value: string; onChange: (v: string) => void; onBlur: () => void; error?: string }) {
  return (
    <div>
      <label htmlFor="item-code" className="block text-sm font-semibold text-slate-800 mb-1">Código do Material *</label>
      <input
        id="item-code"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'item-code-err' : undefined}
        placeholder="Ex: BRO-0042, EPI-1001"
        className="w-full px-3 py-2 border rounded-md font-mono text-sm uppercase focus:ring-2 focus:ring-blue-600 focus:outline-none border-slate-300"
        required
      />
      {error && <p id="item-code-err" className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function QuantityInput({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  return (
    <div>
      <label htmlFor="qty-input" className="block text-sm font-semibold text-slate-800 mb-1">Quantidade *</label>
      <input
        id="qty-input"
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'qty-err' : undefined}
        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none border-slate-300"
        required
      />
      {error && <p id="qty-err" className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function ShiftSelect({ value, onChange, error }: { value: Shift; onChange: (v: Shift) => void; error?: string }) {
  return (
    <div>
      <label htmlFor="shift-input" className="block text-sm font-semibold text-slate-800 mb-1">Turno Operacional *</label>
      <select
        id="shift-input"
        value={value}
        onChange={(e) => onChange(e.target.value as Shift)}
        aria-invalid={Boolean(error)}
        className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none border-slate-300"
      >
        <option value="A">Turno A (Manhã)</option>
        <option value="B">Turno B (Tarde)</option>
        <option value="C">Turno C (Noite)</option>
      </select>
      {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function BadgeInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <label htmlFor="badge-input" className="block text-sm font-semibold text-slate-800 mb-1">Matrícula do Técnico *</label>
      <input
        id="badge-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'badge-err' : undefined}
        placeholder="Ex: T-10931"
        className="w-full px-3 py-2 border rounded-md text-sm uppercase focus:ring-2 focus:ring-blue-600 focus:outline-none border-slate-300"
        required
      />
      {error && <p id="badge-err" className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function FormButtons({ isSubmitting, onReset }: { isSubmitting: boolean; onReset: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
      >
        {isSubmitting ? 'Registrando...' : 'Confirmar Retirada'}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
        className="py-2.5 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-md transition-colors"
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
        <QuantityInput value={props.quantity} onChange={props.onQuantityChange} error={props.errors.quantity} />
        <ShiftSelect value={props.shift} onChange={props.onShiftChange} error={props.errors.shift} />
      </div>
      <BadgeInput value={props.technicianBadge} onChange={props.onTechnicianBadgeChange} error={props.errors.technicianBadge} />
      <FormButtons isSubmitting={props.isSubmitting} onReset={props.onReset} />
    </form>
  );
}
