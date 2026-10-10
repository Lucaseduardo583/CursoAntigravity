<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso;

use Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs\ItemRespostaDTO;
use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Item;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;

/**
 * Caso de uso para listar todos os itens que atingiram ou estão abaixo do estoque mínimo.
 */
class ListarItensRupturaCasoDeUso
{
    public function __construct(
        private readonly ItemRepositorioInterface $itemRepositorio
    ) {
    }

    /**
     * @return ItemRespostaDTO[]
     */
    public function executar(): array
    {
        $itens = $this->itemRepositorio->listarAbaixoOuNoMinimo();

        return array_map(
            static fn (Item $item): ItemRespostaDTO => ItemRespostaDTO::aPartirDeEntidade($item),
            $itens
        );
    }
}
