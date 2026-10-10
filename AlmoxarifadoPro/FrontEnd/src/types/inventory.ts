/**
 * Suposições adotadas:
 * - O backend expõe o item com código, nome, categoria, saldoAtual, saldoMinimo e alertaRuptura.
 * - Turnos válidos na fábrica são estritamente 'A', 'B' ou 'C'.
 * - Todas as datas retornadas e enviadas seguem o padrão ISO 8601 com timezone.
 */

export type Shift = 'A' | 'B' | 'C';

export type MovementType = 'retirada' | 'reposicao';

export interface ItemBalance {
  codigo: string;
  nome: string;
  categoria: string;
  saldoAtual: number;
  saldoMinimo: number;
  alertaRuptura: boolean;
}

export interface WithdrawalPayload {
  item_codigo: string;
  tipo: MovementType;
  quantidade: number;
  tecnico_matricula: string;
  turno: Shift;
  data_hora: string;
}

export interface WithdrawalResponse {
  id: number;
  itemCodigo: string;
  tipo: string;
  quantidade: number;
  tecnicoMatricula: string;
  turno: Shift;
  dataHora: string;
}

export interface ApiErrorResponse {
  sucesso: false;
  erro: string;
  detalhes?: Record<string, string>;
}

export interface FormErrors {
  itemCode?: string;
  quantity?: string;
  technicianBadge?: string;
  shift?: string;
}
