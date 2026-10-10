<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia;

use Closure;
use Metalurgica\AlmoxarifadoPro\Dominio\Repositorios\TransacaoGerenciadorInterface;
use PDO;
use Throwable;

/**
 * Gerenciador de transações atômicas utilizando o mecanismo nativo do PDO.
 */
class PdoTransacaoGerenciador implements TransacaoGerenciadorInterface
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function executarTransacionalmente(Closure $operacao): mixed
    {
        if ($this->pdo->inTransaction()) {
            return $operacao();
        }

        $this->pdo->beginTransaction();
        try {
            $resultado = $operacao();
            $this->pdo->commit();
            return $resultado;
        } catch (Throwable $erro) {
            $this->pdo->rollBack();
            throw $erro;
        }
    }
}
