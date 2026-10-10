<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Enums;

/**
 * Representa os tipos permitidos de movimentação no almoxarifado.
 */
enum TipoMovimentacao: string
{
    case RETIRADA = 'retirada';
    case REPOSICAO = 'reposicao';

    /**
     * Valida se a string informada corresponde a um tipo válido.
     */
    public static function tentarCriar(string $valor): ?self
    {
        return self::tryFrom(strtolower(trim($valor)));
    }
}
