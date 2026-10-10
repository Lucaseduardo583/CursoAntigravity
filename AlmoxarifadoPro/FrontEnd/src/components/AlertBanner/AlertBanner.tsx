/**
 * Suposições adotadas:
 * - O alerta possui variantes de erro, aviso e sucesso estilizados para tema industrial de alto contraste.
 * - Utiliza atributos ARIA para leitura acessível imediata de mensagens.
 */

interface AlertBannerProps {
  type: 'error' | 'warning' | 'success';
  message: string;
  onDismiss?: () => void;
}

const STYLES = {
  error: 'bg-rose-950/40 border-rose-500/50 text-rose-200',
  warning: 'bg-amber-950/40 border-amber-500/50 text-amber-200',
  success: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200',
};

const ICONS = {
  error: '⛔',
  warning: '⚠',
  success: '✓',
};

export function AlertBanner({ type, message, onDismiss }: AlertBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start justify-between p-4 rounded-xl border shadow-lg mb-6 backdrop-blur-md ${STYLES[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg select-none" aria-hidden="true">{ICONS[type]}</span>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar mensagem"
          className="ml-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
        >
          Fechar
        </button>
      )}
    </div>
  );
}
