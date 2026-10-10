/**
 * Suposições adotadas:
 * - A página principal combina o cabeçalho executivo, atalhos de itens frequentes, alertas e histórico.
 * - Ao selecionar um item de alta rotatividade, preenche o código e consulta o saldo no PostgreSQL.
 */

import { useCallback } from 'react';
import { useItemLookup } from '../hooks/useItemLookup';
import { useWithdrawalForm } from '../hooks/useWithdrawalForm';
import { Header } from '../components/Header/Header';
import { AlertBanner } from '../components/AlertBanner/AlertBanner';
import { ItemStockCard } from '../components/ItemStockCard/ItemStockCard';
import { WithdrawalForm } from '../components/WithdrawalForm/WithdrawalForm';
import { RecentWithdrawals } from '../components/RecentWithdrawals/RecentWithdrawals';
import { ItemQuickSelector } from '../components/ItemQuickSelector/ItemQuickSelector';
import { RuptureAlerts } from '../components/RuptureAlerts/RuptureAlerts';

export function WithdrawalPage() {
  const { item, isLoading, lookupError, lookup, clear } = useItemLookup();
  const form = useWithdrawalForm(item, useCallback((code: string) => lookup(code), [lookup]));

  const handleBlur = useCallback(() => lookup(form.itemCode), [lookup, form.itemCode]);
  const handleReset = useCallback(() => { form.resetForm(); clear(); }, [form, clear]);

  const handleSelectQuick = useCallback((code: string) => {
    form.setItemCode(code);
    lookup(code);
  }, [form, lookup]);

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <RuptureAlerts onSelectItem={handleSelectQuick} />
        <AlertBanner type="error" message={lookupError || form.submitError || ''} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section aria-labelledby="form-heading" className="lg:col-span-7 bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
            <h2 id="form-heading" className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <span>Registrar Retirada de Material</span>
              <span className="text-xs font-mono font-medium text-slate-400">Terminal Almoxarife</span>
            </h2>
            <ItemQuickSelector selectedCode={form.itemCode} onSelect={handleSelectQuick} />
            <WithdrawalForm
              itemCode={form.itemCode}
              onItemCodeChange={form.setItemCode}
              onItemBlur={handleBlur}
              quantity={form.quantity}
              onQuantityChange={form.setQuantity}
              technicianBadge={form.technicianBadge}
              onTechnicianBadgeChange={form.setTechnicianBadge}
              shift={form.shift}
              onShiftChange={form.setShift}
              errors={form.errors}
              isSubmitting={form.isSubmitting}
              onSubmit={form.handleSubmit}
              onReset={handleReset}
            />
          </section>

          <aside aria-label="Painel de inventário e histórico" className="lg:col-span-5 space-y-6">
            <ItemStockCard item={item} isLoading={isLoading} />
            <RecentWithdrawals movements={form.recentMovements} />
          </aside>
        </div>
      </main>
    </div>
  );
}
