<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Repositorios;

use Closure;

/**
 * Contrato para controle de transações SQL atômicas.
 */
interface TransacaoGerenciadorInterface
{
    /**
     * Executa uma operação encapsulada dentro de transação atômica.
     *
     * @template T
     * @param Closure(): T $operacao
     * @return T
     */
    public function executarTransacionalmente(Closure $operacao): mixed;
}
