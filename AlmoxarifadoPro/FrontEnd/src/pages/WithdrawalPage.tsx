/**
 * Suposições adotadas:
 * - A tela centraliza o fluxo de retirada e atualização de estoque do almoxarife.
 * - Ao confirmar a retirada com sucesso, o saldo do item é reconsultado imediatamente.
 */

import React, { useCallback } from 'react';
import { useItemLookup } from '../hooks/useItemLookup';
import { useWithdrawalForm } from '../hooks/useWithdrawalForm';
import { AlertBanner } from '../components/AlertBanner/AlertBanner';
import { ItemStockCard } from '../components/ItemStockCard/ItemStockCard';
import { WithdrawalForm } from '../components/WithdrawalForm/WithdrawalForm';
import { RecentWithdrawals } from '../components/RecentWithdrawals/RecentWithdrawals';

function Header() {
  return (
    <header className="mb-6 border-b border-slate-200 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Metalúrgica Vale do Aço S/A</span>
          <h1 className="text-2xl font-black text-slate-900">Almoxarifado Central — Registro de Retirada</h1>
        </div>
        <div className="text-xs text-slate-500 font-medium">Terminal Interno de Operação</div>
      </div>
    </header>
  );
}

export function WithdrawalPage() {
  const { item, isLoading, lookupError, lookup, clear } = useItemLookup();
  const form = useWithdrawalForm(item, useCallback((code: string) => lookup(code), [lookup]));

  const handleBlur = useCallback(() => lookup(form.itemCode), [lookup, form.itemCode]);
  const handleReset = useCallback(() => { form.resetForm(); clear(); }, [form, clear]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 text-slate-800">
      <Header />
      <AlertBanner type="error" message={lookupError || form.submitError || ''} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section aria-labelledby="form-heading" className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 id="form-heading" className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Dados da Movimentação
          </h2>
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
        <aside aria-label="Informações de saldo e histórico" className="lg:col-span-5 space-y-6">
          <ItemStockCard item={item} isLoading={isLoading} />
          <RecentWithdrawals movements={form.recentMovements} />
        </aside>
      </div>
    </main>
  );
}
