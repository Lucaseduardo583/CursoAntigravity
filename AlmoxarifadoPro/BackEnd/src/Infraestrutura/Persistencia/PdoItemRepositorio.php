<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia;

use Metalurgica\AlmoxarifadoPro\Dominio\Entidades\Item;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;
use PDO;

/**
 * Implementação PDO para persistência de itens do almoxarifado.
 */
class PdoItemRepositorio implements ItemRepositorioInterface
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function buscarPorCodigo(string $codigo, bool $comBloqueio = false): ?Item
    {
        $sql = 'SELECT id, codigo, nome, categoria, saldo_atual, saldo_minimo '
            . 'FROM itens WHERE codigo = :codigo';
        if ($comBloqueio) {
            $sql .= ' FOR UPDATE';
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':codigo' => $codigo]);
        $linha = $stmt->fetch();

        return $linha ? $this->hidratarItem($linha) : null;
    }

    public function atualizarSaldo(Item $item): void
    {
        $sql = 'UPDATE itens SET saldo_atual = :saldo, updated_at = CURRENT_TIMESTAMP '
            . 'WHERE codigo = :codigo';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':saldo' => $item->obterSaldoAtual(),
            ':codigo' => $item->obterCodigo(),
        ]);
    }

    public function listarAbaixoOuNoMinimo(): array
    {
        $sql = 'SELECT id, codigo, nome, categoria, saldo_atual, saldo_minimo '
            . 'FROM itens WHERE saldo_atual <= saldo_minimo ORDER BY codigo ASC';
        $stmt = $this->pdo->query($sql);
        $linhas = $stmt->fetchAll();

        return array_map(fn (array $l): Item => $this->hidratarItem($l), $linhas);
    }

    private function hidratarItem(array $linha): Item
    {
        return new Item(
            (string) $linha['codigo'],
            (string) $linha['nome'],
            (string) $linha['categoria'],
            (int) $linha['saldo_atual'],
            (int) $linha['saldo_minimo'],
            isset($linha['id']) ? (int) $linha['id'] : null
        );
    }
}
