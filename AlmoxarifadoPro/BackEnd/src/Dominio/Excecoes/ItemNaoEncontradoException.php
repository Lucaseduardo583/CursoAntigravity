<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Excecoes;

use DomainException;

/**
 * Lançada quando um item solicitado não é localizado no almoxarifado.
 */
class ItemNaoEncontradoException extends DomainException
{
    public function __construct(string $codigoItem)
    {
        parent::__construct("Item com código '{$codigoItem}' não foi encontrado no almoxarifado.");
    }
}
