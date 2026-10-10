<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Http;

use DateTimeImmutable;
use Exception;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\ConsultarHistoricoMovimentacoesCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\DTOs\RegistrarMovimentacaoDTO;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\RegistrarReposicaoCasoDeUso;
use Metalurgica\AlmoxarifadoPro\CasosDeUso\RegistrarRetiradaCasoDeUso;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\Turno;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;

/**
 * Controlador HTTP para operações de movimentação de estoque.
 */
class ControladorMovimentacao
{
    public function __construct(
        private readonly RegistrarRetiradaCasoDeUso $retiradaCasoDeUso,
        private readonly RegistrarReposicaoCasoDeUso $reposicaoCasoDeUso,
        private readonly ConsultarHistoricoMovimentacoesCasoDeUso $historicoCasoDeUso
    ) {
    }

    public function registrarRetirada(Requisicao $requisicao): RespostaJson
    {
        $dto = $this->validarEMontarDTO($requisicao->obterCorpo(), TipoMovimentacao::RETIRADA);
        $resultado = $this->retiradaCasoDeUso->executar($dto);
        return RespostaJson::sucesso($resultado, 201);
    }

    public function registrarReposicao(Requisicao $requisicao): RespostaJson
    {
        $dto = $this->validarEMontarDTO($requisicao->obterCorpo(), TipoMovimentacao::REPOSICAO);
        $resultado = $this->reposicaoCasoDeUso->executar($dto);
        return RespostaJson::sucesso($resultado, 201);
    }

    public function consultarHistorico(Requisicao $requisicao): RespostaJson
    {
        $tecnico = $requisicao->obterQuery('tecnico');
        $turnoStr = $requisicao->obterQuery('turno');
        $turno = $turnoStr !== null ? Turno::tentarCriar($turnoStr) : null;
        if ($turnoStr !== null && $turno === null) {
            throw new DadosInvalidosException('Turno inválido. Valores permitidos: A, B, C.');
        }

        $resultado = $this->historicoCasoDeUso->executar($tecnico, $turno);
        return RespostaJson::sucesso($resultado, 200);
    }

    private function validarEMontarDTO(array $dados, TipoMovimentacao $tipo): RegistrarMovimentacaoDTO
    {
        $itemCodigo = $this->obterCampoTexto($dados, 'item_codigo');
        $quantidade = $this->obterQuantidadeValida($dados);
        $matricula = $this->obterCampoTexto($dados, 'tecnico_matricula');
        $turno = $this->obterTurnoValido($dados);
        $dataHora = $this->obterDataHoraValida($dados);

        return new RegistrarMovimentacaoDTO($itemCodigo, $tipo, $quantidade, $matricula, $turno, $dataHora);
    }

    private function obterCampoTexto(array $dados, string $campo): string
    {
        if (empty($dados[$campo]) || !is_string($dados[$campo]) || trim($dados[$campo]) === '') {
            throw new DadosInvalidosException("O campo '{$campo}' é obrigatório.");
        }
        return trim($dados[$campo]);
    }

    private function obterQuantidadeValida(array $dados): int
    {
        if (!isset($dados['quantidade']) || !is_int($dados['quantidade']) || $dados['quantidade'] <= 0) {
            throw new DadosInvalidosException("O campo 'quantidade' deve ser um inteiro positivo.");
        }
        return $dados['quantidade'];
    }

    private function obterTurnoValido(array $dados): Turno
    {
        $turnoStr = $dados['turno'] ?? null;
        if (!is_string($turnoStr) || ($turno = Turno::tentarCriar($turnoStr)) === null) {
            throw new DadosInvalidosException("Turno inválido. Esperado 'A', 'B' ou 'C'.");
        }
        return $turno;
    }

    private function obterDataHoraValida(array $dados): DateTimeImmutable
    {
        $dataStr = $dados['data_hora'] ?? null;
        if ($dataStr === null) {
            return new DateTimeImmutable();
        }
        try {
            return new DateTimeImmutable((string) $dataStr);
        } catch (Exception) {
            throw new DadosInvalidosException('Formato de data_hora inválido. Esperado ISO 8601.');
        }
    }
}
