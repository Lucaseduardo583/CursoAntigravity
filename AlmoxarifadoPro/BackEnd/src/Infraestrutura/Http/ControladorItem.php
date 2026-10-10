<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Http;

use Metalurgica\AlmoxarifadoPro\CasosDeUso\ConsultarSaldoItemCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\ListarItensRupturaCasoDeUso;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;

/**
 * Controlador HTTP para consultas de itens e monitoramento de saldo.
 */
class ControladorItem
{
    public function __construct(
        private readonly ConsultarSaldoItemCasoDeUso $saldoCasoDeUso,
        private readonly ListarItensRupturaCasoDeUso $rupturaCasoDeUso
    ) {
    }

    public function consultarSaldo(Requisicao $requisicao, string $codigo): RespostaJson
    {
        $codigoLimpo = trim($codigo);
        if ($codigoLimpo === '') {
            throw new DadosInvalidosException('Código do item é obrigatório.');
        }

        $resultado = $this->saldoCasoDeUso->executar($codigoLimpo);
        return RespostaJson::sucesso($resultado, 200);
    }

    public function listarItensRuptura(Requisicao $requisicao): RespostaJson
    {
        $itens = $this->rupturaCasoDeUso->executar();
        return RespostaJson::sucesso($itens, 200);
    }
}
