<?php

declare(strict_types=1);

use Metalurgica\AlmoxarifadoPro\CasosDeUso\ConsultarHistoricoMovimentacoesCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\ConsultarSaldoItemCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\ListarItensRupturaCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\RegistrarReposicaoCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\RegistrarRetiradaCasoDeUso;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Http\ControladorItem;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Http\ControladorMovimentacao;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Http\Requisicao;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Http\Roteador;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia\PdoConexaoFabrica;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia\PdoItemRepositorio;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia\PdoMovimentacaoRepositorio;
use Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia\PdoTransacaoGerenciador;

require_once __DIR__ . '/../vendor/autoload.php';

\Metalurgica\AlmoxarifadoPro\Infraestrutura\Ambiente::carregar(__DIR__ . '/../.env');

$pdo = PdoConexaoFabrica::criar();
$transacaoGerenciador = new PdoTransacaoGerenciador($pdo);
$itemRepo = new PdoItemRepositorio($pdo);
$movRepo = new PdoMovimentacaoRepositorio($pdo);

$retiradaUC = new RegistrarRetiradaCasoDeUso($itemRepo, $movRepo, $transacaoGerenciador);
$reposicaoUC = new RegistrarReposicaoCasoDeUso($itemRepo, $movRepo, $transacaoGerenciador);
$historicoUC = new ConsultarHistoricoMovimentacoesCasoDeUso($movRepo);
$saldoUC = new ConsultarSaldoItemCasoDeUso($itemRepo);
$rupturaUC = new ListarItensRupturaCasoDeUso($itemRepo);

$movCtrl = new ControladorMovimentacao($retiradaUC, $reposicaoUC, $historicoUC);
$itemCtrl = new ControladorItem($saldoUC, $rupturaUC);

$roteador = new Roteador($movCtrl, $itemCtrl);
$roteador->despachar(Requisicao::capturar());
