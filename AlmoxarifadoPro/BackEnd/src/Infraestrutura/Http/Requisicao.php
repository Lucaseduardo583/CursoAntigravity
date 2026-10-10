<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Http;

use JsonException;
use Metalurgica\AlmoxarifadoPro\Dominio\Excecoes\DadosInvalidosException;

/**
 * Abstrai a requisição HTTP recebida.
 */
class Requisicao
{
    /**
     * @param array<string, mixed> $parametrosQuery
     * @param array<string, mixed> $corpoJson
     */
    public function __construct(
        private readonly string $metodo,
        private readonly string $caminho,
        private readonly array $parametrosQuery,
        private readonly array $corpoJson
    ) {
    }

    public static function capturar(): self
    {
        $metodo = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $query = $_GET;
        $corpo = self::lerCorpoJson();

        return new self($metodo, $uri, $query, $corpo);
    }

    /**
     * @return array<string, mixed>
     */
    private static function lerCorpoJson(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        try {
            $dados = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
            return is_array($dados) ? $dados : [];
        } catch (JsonException) {
            throw new DadosInvalidosException('Payload JSON inválido ou malformado.');
        }
    }

    public function obterMetodo(): string
    {
        return $this->metodo;
    }

    public function obterCaminho(): string
    {
        return $this->caminho;
    }

    public function obterQuery(string $chave, ?string $padrao = null): ?string
    {
        return isset($this->parametrosQuery[$chave])
            ? (string) $this->parametrosQuery[$chave]
            : $padrao;
    }

    /**
     * @return array<string, mixed>
     */
    public function obterCorpo(): array
    {
        return $this->corpoJson;
    }
}
