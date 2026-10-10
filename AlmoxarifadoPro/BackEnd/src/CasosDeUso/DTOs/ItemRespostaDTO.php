<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs;

use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Item;

/**
 * Objeto de transferência para expor dados de um item e seu saldo.
 */
readonly class ItemRespostaDTO
{
    public function __construct(
        public string $codigo,
        public string $nome,
        public string $categoria,
        public int $saldoAtual,
        public int $saldoMinimo,
        public bool $alertaRuptura
    ) {
    }

    /**
     * Mapeia a entidade Item para o DTO de resposta.
     */
    public static function aPartirDeEntidade(Item $item): self
    {
        return new self(
            $item->obterCodigo(),
            $item->obterNome(),
            $item->obterCategoria(),
            $item->obterSaldoAtual(),
            $item->obterSaldoMinimo(),
            $item->estaAbaixoOuNoMinimo()
        );
    }
}
