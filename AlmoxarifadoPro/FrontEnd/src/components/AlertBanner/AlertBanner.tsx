/**
 * Suposições adotadas:
 * - O componente suporta as variantes 'error', 'warning' e 'success' com contraste AAA/AA.
 * - Utiliza atributos ARIA nativos para leitores de tela anunciarem mudanças de estado.
 */

import React from 'react';

interface AlertBannerProps {
  type: 'error' | 'warning' | 'success';
  message: string;
  onDismiss?: () => void;
}

const STYLES = {
  error: 'bg-red-50 border-red-700 text-red-950',
  warning: 'bg-amber-50 border-amber-700 text-amber-950',
  success: 'bg-emerald-50 border-emerald-700 text-emerald-950',
};

export function AlertBanner({ type, message, onDismiss }: AlertBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start justify-between p-4 border-l-4 rounded-r-md shadow-sm mb-4 ${STYLES[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg select-none" aria-hidden="true">
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'success' && '✓'}
        </span>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar mensagem de alerta"
          className="ml-4 text-sm font-semibold underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
        >
          Fechar
        </button>
      )}
    </div>
  );
}
