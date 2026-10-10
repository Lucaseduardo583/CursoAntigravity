<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Http;

use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\ItemNaoEncontradoException;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\SaldoInsuficienteException;
use Throwable;

/**
 * Roteador HTTP simplificado para despacho de rotas e tratamento central de erros.
 */
class Roteador
{
    public function __construct(
        private readonly ControladorMovimentacao $movimentacaoCtrl,
        private readonly ControladorItem $itemCtrl
    ) {
    }

    public function despachar(Requisicao $req): void
    {
        try {
            $resposta = $this->executarRota($req);
            $resposta->enviar();
        } catch (Throwable $e) {
            $this->tratarExcecao($e)->enviar();
        }
    }

    private function executarRota(Requisicao $req): RespostaJson
    {
        $metodo = $req->obterMetodo();
        $caminho = rtrim($req->obterCaminho(), '/');

        if ($metodo === 'POST' && $caminho === '/api/movimentacoes/retirada') {
            return $this->movimentacaoCtrl->registrarRetirada($req);
        }
        if ($metodo === 'POST' && $caminho === '/api/movimentacoes/reposicao') {
            return $this->movimentacaoCtrl->registrarReposicao($req);
        }
        if ($metodo === 'GET' && $caminho === '/api/movimentacoes') {
            return $this->movimentacaoCtrl->consultarHistorico($req);
        }
        if ($metodo === 'GET' && $caminho === '/api/itens/ruptura') {
            return $this->itemCtrl->listarItensRuptura($req);
        }
        if ($metodo === 'GET' && preg_match('#^/api/itens/([^/]+)/saldo$#', $caminho, $m)) {
            return $this->itemCtrl->consultarSaldo($req, urldecode($m[1]));
        }

        return RespostaJson::erro('Recurso não encontrado.', 404);
    }

    private function tratarExcecao(Throwable $erro): RespostaJson
    {
        if ($erro instanceof DadosInvalidosException) {
            return RespostaJson::erro($erro->getMessage(), 422);
        }
        if ($erro instanceof ItemNaoEncontradoException) {
            return RespostaJson::erro($erro->getMessage(), 404);
        }
        if ($erro instanceof SaldoInsuficienteException) {
            return RespostaJson::erro($erro->getMessage(), 409);
        }

        error_log((string) $erro);
        return RespostaJson::erro('Erro interno do servidor.', 500);
    }
}
