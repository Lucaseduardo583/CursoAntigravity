<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Enums;

/**
 * Representa os turnos operacionais de produção da fábrica.
 */
enum Turno: string
{
    case TURNO_A = 'A';
    case TURNO_B = 'B';
    case TURNO_C = 'C';

    /**
     * Valida e obtém o turno a partir de valor textual.
     */
    public static function tentarCriar(string $valor): ?self
    {
        return self::tryFrom(strtoupper(trim($valor)));
    }
}
