<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia;

use DateTimeImmutable;
use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use Metalurgica\AlmoxarifadoPro\Dominio\Enums\Turno;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\MovimentacaoRepositorioInterface;
use PDO;

/**
 * Implementação PDO para persistência de movimentações de estoque.
 */
class PdoMovimentacaoRepositorio implements MovimentacaoRepositorioInterface
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function salvar(Movimentacao $movimentacao): Movimentacao
    {
        $sql = 'INSERT INTO movimentacoes (item_codigo, tipo, quantidade, '
            . 'tecnico_matricula, turno, data_hora) VALUES (:item, :tipo, :qtd, '
            . ':tecnico, :turno, :data_hora) RETURNING id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':item' => $movimentacao->obterItemCodigo(),
            ':tipo' => $movimentacao->obterTipo()->value,
            ':qtd' => $movimentacao->obterQuantidade(),
            ':tecnico' => $movimentacao->obterTecnicoMatricula(),
            ':turno' => $movimentacao->obterTurno()->value,
            ':data_hora' => $movimentacao->obterDataHora()->format('Y-m-d H:i:sP'),
        ]);
        $id = (int) $stmt->fetchColumn();

        return new Movimentacao(
            $movimentacao->obterItemCodigo(),
            $movimentacao->obterTipo(),
            $movimentacao->obterQuantidade(),
            $movimentacao->obterTecnicoMatricula(),
            $movimentacao->obterTurno(),
            $movimentacao->obterDataHora(),
            $id
        );
    }

    public function listarPorTecnicoOuTurno(?string $tecnicoMatricula, ?Turno $turno): array
    {
        $condicoes = [];
        $params = [];
        if ($tecnicoMatricula !== null && trim($tecnicoMatricula) !== '') {
            $condicoes[] = 'tecnico_matricula = :tecnico';
            $params[':tecnico'] = trim($tecnicoMatricula);
        }
        if ($turno !== null) {
            $condicoes[] = 'turno = :turno';
            $params[':turno'] = $turno->value;
        }

        $sql = 'SELECT id, item_codigo, tipo, quantidade, tecnico_matricula, turno, data_hora '
            . 'FROM movimentacoes';
        if ($condicoes !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $condicoes);
        }
        $sql .= ' ORDER BY data_hora DESC, id DESC';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $linhas = $stmt->fetchAll();

        return array_map(fn (array $l): Movimentacao => $this->hidratarMovimentacao($l), $linhas);
    }

    private function hidratarMovimentacao(array $l): Movimentacao
    {
        return new Movimentacao(
            (string) $l['item_codigo'],
            TipoMovimentacao::from((string) $l['tipo']),
            (int) $l['quantidade'],
            (string) $l['tecnico_matricula'],
            Turno::from((string) $l['turno']),
            new DateTimeImmutable((string) $l['data_hora']),
            (int) $l['id']
        );
    }
}
