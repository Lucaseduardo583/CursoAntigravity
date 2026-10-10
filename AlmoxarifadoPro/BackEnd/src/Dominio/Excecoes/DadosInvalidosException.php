<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Excecoes;

use InvalidArgumentException;

/**
 * Lançada quando parâmetros ou valores de entidade violam regras invariantes.
 */
class DadosInvalidosException extends InvalidArgumentException
{
    public function __construct(string $mensagem)
    {
        parent::__construct($mensagem);
    }
}
