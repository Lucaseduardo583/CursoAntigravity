<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Persistencia;

use PDO;

/**
 * Fábrica de conexões PDO nativas com credenciais vindas exclusivamente de ambiente.
 */
class PdoConexaoFabrica
{
    public static function criar(): PDO
    {
        $host = (string) ($_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1');
        $port = (string) ($_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '5432');
        $nome = (string) ($_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'almoxarifado_db');
        $user = (string) ($_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'postgres');
        $pass = (string) ($_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: '');

        $dsn = "pgsql:host={$host};port={$port};dbname={$nome}";
        $opcoes = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        return new PDO($dsn, $user, $pass, $opcoes);
    }
}
