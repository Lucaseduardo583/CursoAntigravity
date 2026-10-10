<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Repositorios;

use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Item;

/**
 * Contrato de persistência para agregação de itens de estoque.
 */
interface ItemRepositorioInterface
{
    /**
     * Busca item por código único com bloqueio de concorrência opcional.
     */
    public function buscarPorCodigo(string $codigo, bool $comBloqueio = false): ?Item;

    /**
     * Atualiza o saldo persistido do item.
     */
    public function atualizarSaldo(Item $item): void;

    /**
     * Retorna todos os itens cujo saldo_atual <= saldo_minimo.
     *
     * @return Item[]
     */
    public function listarAbaixoOuNoMinimo(): array;
}
