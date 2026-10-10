<?php

declare(strict_types=1);

namespace Metalurgica\AlmoxarifadoPro\Infraestrutura\Http;

/**
 * Encapsula a resposta HTTP formatada em JSON.
 */
class RespostaJson
{
    public function __construct(
        private readonly mixed $dados,
        private readonly int $codigoStatus = 200
    ) {
    }

    public static function sucesso(mixed $dados, int $status = 200): self
    {
        return new self($dados, $status);
    }

    public static function erro(string $mensagem, int $status, array $detalhes = []): self
    {
        $payload = ['sucesso' => false, 'erro' => $mensagem];
        if ($detalhes !== []) {
            $payload['detalhes'] = $detalhes;
        }
        return new self($payload, $status);
    }

    public function enviar(): void
    {
        http_response_code($this->codigoStatus);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($this->dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
