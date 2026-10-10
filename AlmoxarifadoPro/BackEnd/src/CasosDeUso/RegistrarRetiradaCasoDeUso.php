<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\CasosDeUso;

use Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs\MovimentacaoRespostaDTO;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs\RegistrarMovimentacaoDTO;
use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\ItemNaoEncontradoException;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\MovimentacaoRepositorioInterface;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\TransacaoGerenciadorInterface;

/**
 * Caso de uso para registrar a retirada de itens com atualização atômica de saldo.
 */
class RegistrarRetiradaCasoDeUso
{
    public function __construct(
        private readonly ItemRepositorioInterface $itemRepositorio,
        private readonly MovimentacaoRepositorioInterface $movimentacaoRepositorio,
        private readonly TransacaoGerenciadorInterface $transacaoGerenciador
    ) {
    }

    public function executar(RegistrarMovimentacaoDTO $dto): MovimentacaoRespostaDTO
    {
        return $this->transacaoGerenciador->executarTransacionalmente(
            fn (): MovimentacaoRespostaDTO => $this->processarRetirada($dto)
        );
    }

    private function processarRetirada(RegistrarMovimentacaoDTO $dto): MovimentacaoRespostaDTO
    {
        $item = $this->itemRepositorio->buscarPorCodigo($dto->itemCodigo, true);
        if ($item === null) {
            throw new ItemNaoEncontradoException($dto->itemCodigo);
        }

        $item->debitarSaldo($dto->quantidade);
        $this->itemRepositorio->atualizarSaldo($item);

        $movimentacao = new Movimentacao(
            $item->obterCodigo(),
            $dto->tipo,
            $dto->quantidade,
            $dto->tecnicoMatricula,
            $dto->turno,
            $dto->dataHora
        );

        $salva = $this->movimentacaoRepositorio->salvar($movimentacao);
        return MovimentacaoRespostaDTO::aPartirDeEntidade($salva);
    }
}
