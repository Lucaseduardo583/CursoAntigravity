<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Entidades;

use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\SaldoInsuficienteException;

/**
 * Entidade de domínio que representa um item ou ferramenta em estoque.
 */
class Item
{
    public function __construct(
        private readonly string $codigo,
        private readonly string $nome,
        private readonly string $categoria,
        private int $saldoAtual,
        private readonly int $saldoMinimo,
        private readonly ?int $id = null
    ) {
        if (trim($this->codigo) === '') {
            throw new DadosInvalidosException('O código do item não pode ser vazio.');
        }
        if ($this->saldoAtual < 0 || $this->saldoMinimo < 0) {
            throw new DadosInvalidosException('Saldos não podem ser negativos.');
        }
    }

    public function debitarSaldo(int $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new DadosInvalidosException('Quantidade para débito deve ser maior que zero.');
        }
        if ($this->saldoAtual < $quantidade) {
            throw new SaldoInsuficienteException($this->codigo, $this->saldoAtual, $quantidade);
        }
        $this->saldoAtual -= $quantidade;
    }

    public function creditarSaldo(int $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new DadosInvalidosException('Quantidade para crédito deve ser maior que zero.');
        }
        $this->saldoAtual += $quantidade;
    }

    public function estaAbaixoOuNoMinimo(): bool
    {
        return $this->saldoAtual <= $this->saldoMinimo;
    }

    public function obterCodigo(): string
    {
        return $this->codigo;
    }

    public function obterNome(): string
    {
        return $this->nome;
    }

    public function obterCategoria(): string
    {
        return $this->categoria;
    }

    public function obterSaldoAtual(): int
    {
        return $this->saldoAtual;
    }

    public function obterSaldoMinimo(): int
    {
        return $this->saldoMinimo;
    }

    public function obterId(): ?int
    {
        return $this->id;
    }
}
