<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Entidades;

use DateTimeImmutable;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\Turno;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;

/**
 * Entidade de domínio que representa o registro imutável de movimentação.
 */
class Movimentacao
{
    public function __construct(
        private readonly string $itemCodigo,
        private readonly TipoMovimentacao $tipo,
        private readonly int $quantidade,
        private readonly string $tecnicoMatricula,
        private readonly Turno $turno,
        private readonly DateTimeImmutable $dataHora,
        private readonly ?int $id = null
    ) {
        if (trim($this->itemCodigo) === '') {
            throw new DadosInvalidosException('Código do item é obrigatório.');
        }
        if ($this->quantidade <= 0) {
            throw new DadosInvalidosException('A quantidade da movimentação deve ser maior que zero.');
        }
        if (trim($this->tecnicoMatricula) === '') {
            throw new DadosInvalidosException('A matrícula do técnico é obrigatória.');
        }
    }

    public function obterItemCodigo(): string
    {
        return $this->itemCodigo;
    }

    public function obterTipo(): TipoMovimentacao
    {
        return $this->tipo;
    }

    public function obterQuantidade(): int
    {
        return $this->quantidade;
    }

    public function obterTecnicoMatricula(): string
    {
        return $this->tecnicoMatricula;
    }

    public function obterTurno(): Turno
    {
        return $this->turno;
    }

    public function obterDataHora(): DateTimeImmutable
    {
        return $this->dataHora;
    }

    public function obterId(): ?int
    {
        return $this->id;
    }
}
