<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs;

use DateTimeImmutable;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\Turno;

/**
 * Objeto de transferência para dados de entrada de movimentação.
 */
readonly class RegistrarMovimentacaoDTO
{
    public function __construct(
        public string $itemCodigo,
        public TipoMovimentacao $tipo,
        public int $quantidade,
        public string $tecnicoMatricula,
        public Turno $turno,
        public DateTimeImmutable $dataHora
    ) {
    }
}
