<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Dominio\Repositorios;

use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\Turno;

/**
 * Contrato de persistência para as movimentações de retirada e reposição.
 */
interface MovimentacaoRepositorioInterface
{
    /**
     * Persiste o registro de uma nova movimentação.
     */
    public function salvar(Movimentacao $movimentacao): Movimentacao;

    /**
     * Consulta o histórico de movimentações filtrado por técnico ou turno.
     *
     * @return Movimentacao[]
     */
    public function listarPorTecnicoOuTurno(?string $tecnicoMatricula, ?Turno $turno): array;
}
