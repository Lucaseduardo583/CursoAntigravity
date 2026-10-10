<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso;

use Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs\ItemRespostaDTO;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\ItemNaoEncontradoException;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;

/**
 * Caso de uso para consultar o saldo e status de ruptura de um item específico.
 */
class ConsultarSaldoItemCasoDeUso
{
    public function __construct(
        private readonly ItemRepositorioInterface $itemRepositorio
    ) {
    }

    public function executar(string $codigo): ItemRespostaDTO
    {
        $item = $this->itemRepositorio->buscarPorCodigo($codigo, false);
        if ($item === null) {
            throw new ItemNaoEncontradoException($codigo);
        }

        return ItemRespostaDTO::aPartirDeEntidade($item);
    }
}
