/**
 * Suposições adotadas:
 * - O App disponibiliza link de navegação rápida (skip link) para leitores de tela e navegação via teclado.
 * - Centraliza o container principal com fundo neutro de alto contraste para ambiente industrial.
 */

import React from 'react';
import { WithdrawalPage } from './pages/WithdrawalPage';

export function App() {
  return (
    <div className="min-h-screen bg-slate-100 antialiased font-sans">
      <a
        href="#form-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-blue-800 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Pular para o formulário de retirada
      </a>
      <WithdrawalPage />
    </div>
  );
}

export default App;
