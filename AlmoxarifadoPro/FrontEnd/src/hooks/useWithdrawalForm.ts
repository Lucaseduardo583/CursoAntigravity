/**
 * Suposições adotadas:
 * - A data e hora da retirada é gerada no momento da submissão com o fuso local do navegador.
 * - Uma lista com o histórico de retiradas recentes da sessão corrente é mantida em memória.
 */

import { useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import { Shift, FormErrors, WithdrawalResponse, ItemBalance } from '../types/inventory';
import { submitWithdrawal } from '../services/api';

function validateItemCode(code: string): string | undefined {
  return !code.trim() ? 'Código do item é obrigatório.' : undefined;
}

function validateQuantity(qty: number, item: ItemBalance | null): string | undefined {
  if (!qty || qty <= 0) return 'Informe uma quantidade válida maior que zero.';
  if (item && qty > item.saldoAtual) {
    return `Quantidade (${qty}) excede o saldo disponível (${item.saldoAtual}).`;
  }
  return undefined;
}

function validateTechnician(badge: string): string | undefined {
  return !badge.trim() ? 'Matrícula do técnico é obrigatória.' : undefined;
}

function validateShift(shift: string): string | undefined {
  return !['A', 'B', 'C'].includes(shift) ? 'Selecione um turno de produção válido.' : undefined;
}

export function useWithdrawalForm(
  currentItem: ItemBalance | null,
  onSuccessfulWithdrawal: (itemCode: string) => void
) {
  const [itemCode, setItemCode] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [technicianBadge, setTechnicianBadge] = useState('');
  const [shift, setShift] = useState<Shift>('A');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [recentMovements, setRecentMovements] = useState<WithdrawalResponse[]>([]);

  const resetForm = useCallback(() => {
    setItemCode('');
    setQuantity(1);
    setTechnicianBadge('');
    setErrors({});
    setSubmitError(null);
  }, []);

  const validateAll = useCallback((): boolean => {
    const errs: FormErrors = {
      itemCode: validateItemCode(itemCode),
      quantity: validateQuantity(quantity, currentItem),
      technicianBadge: validateTechnician(technicianBadge),
      shift: validateShift(shift),
    };
    setErrors(errs);
    return !Object.values(errs).some(Boolean);
  }, [itemCode, quantity, technicianBadge, shift, currentItem]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await submitWithdrawal({
        item_codigo: itemCode.trim(),
        tipo: 'retirada',
        quantidade: quantity,
        tecnico_matricula: technicianBadge.trim(),
        turno: shift,
        data_hora: new Date().toISOString(),
      });
      setRecentMovements((prev) => [response, ...prev]);
      onSuccessfulWithdrawal(itemCode.trim());
      resetForm();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Falha na comunicação.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, itemCode, quantity, technicianBadge, shift, onSuccessfulWithdrawal, resetForm]);

  return {
    itemCode, setItemCode,
    quantity, setQuantity,
    technicianBadge, setTechnicianBadge,
    shift, setShift,
    errors, isSubmitting, submitError, recentMovements,
    handleSubmit, resetForm,
  };
}
