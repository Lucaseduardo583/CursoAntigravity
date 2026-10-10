<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Excecoes;

use DomainException;

/**
 * Lançada quando a quantidade de retirada supera o saldo disponível.
 */
class SaldoInsuficienteException extends DomainException
{
    public function __construct(string $codigoItem, int $saldoAtual, int $quantidadeSolicitada)
    {
        $mensagem = "Saldo insuficiente para o item '{$codigoItem}'. "
            . "Disponível: {$saldoAtual}, Solicitado: {$quantidadeSolicitada}.";
        parent::__construct($mensagem);
    }
}
