<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso;

use Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs\MovimentacaoRespostaDTO;
use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\Turno;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\MovimentacaoRepositorioInterface;

/**
 * Caso de uso para consultar histórico de movimentações com filtros.
 */
class ConsultarHistoricoMovimentacoesCasoDeUso
{
    public function __construct(
        private readonly MovimentacaoRepositorioInterface $movimentacaoRepositorio
    ) {
    }

    /**
     * @return MovimentacaoRespostaDTO[]
     */
    public function executar(?string $tecnicoMatricula, ?Turno $turno): array
    {
        $movimentacoes = $this->movimentacaoRepositorio->listarPorTecnicoOuTurno(
            $tecnicoMatricula,
            $turno
        );

        return array_map(
            static fn (Movimentacao $m): MovimentacaoRespostaDTO => MovimentacaoRespostaDTO::aPartirDeEntidade($m),
            $movimentacoes
        );
    }
}
