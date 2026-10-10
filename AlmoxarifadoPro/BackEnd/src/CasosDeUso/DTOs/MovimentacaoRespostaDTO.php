<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs;

use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Movimentacao;

/**
 * Objeto de transferência para expor dados de uma movimentação executada.
 */
readonly class MovimentacaoRespostaDTO
{
    public function __construct(
        public ?int $id,
        public string $itemCodigo,
        public string $tipo,
        public int $quantidade,
        public string $tecnicoMatricula,
        public string $turno,
        public string $dataHora
    ) {
    }

    /**
     * Mapeia a entidade Movimentacao para o DTO de resposta.
     */
    public static function aPartirDeEntidade(Movimentacao $movimentacao): self
    {
        return new self(
            $movimentacao->obterId(),
            $movimentacao->obterItemCodigo(),
            $movimentacao->obterTipo()->value,
            $movimentacao->obterQuantidade(),
            $movimentacao->obterTecnicoMatricula(),
            $movimentacao->obterTurno()->value,
            $movimentacao->obterDataHora()->format('c')
        );
    }
}
