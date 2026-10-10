<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura;

/**
 * Utilitário para carregamento de variáveis de arquivo .env.
 */
class Ambiente
{
    public static function carregar(string $caminho): void
    {
        if (!file_exists($caminho)) {
            return;
        }
        $linhas = file($caminho, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($linhas as $linha) {
            self::processarLinha($linha);
        }
    }

    private static function processarLinha(string $linha): void
    {
        $linha = trim($linha);
        if ($linha === '' || str_starts_with($linha, '#') || !str_contains($linha, '=')) {
            return;
        }
        [$chave, $valor] = explode('=', $linha, 2);
        $chave = trim($chave);
        $valor = trim($valor);
        $_ENV[$chave] = $valor;
        putenv("{$chave}={$valor}");
    }
}
