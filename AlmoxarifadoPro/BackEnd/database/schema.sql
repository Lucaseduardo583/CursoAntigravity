-- ============================================================================
-- SCRIPT DDL: AlmoxarifadoPro - Metalúrgica Vale do Aço S/A
-- Controle de estoque, retirada e reposição de EPIs e ferramentas
-- ============================================================================

-- Tabela de itens/materiais do almoxarifado central
CREATE TABLE IF NOT EXISTS itens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(32) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    saldo_atual INT NOT NULL DEFAULT 0,
    saldo_minimo INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_itens_codigo UNIQUE (codigo),
    CONSTRAINT chk_itens_saldo_atual_nao_negativo CHECK (saldo_atual >= 0),
    CONSTRAINT chk_itens_saldo_minimo_nao_negativo CHECK (saldo_minimo >= 0)
);

-- Tabela transacional de movimentações de estoque
CREATE TABLE IF NOT EXISTS movimentacoes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_codigo VARCHAR(32) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    quantidade INT NOT NULL,
    tecnico_matricula VARCHAR(20) NOT NULL,
    turno CHAR(1) NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimentacoes_item FOREIGN KEY (item_codigo) 
        REFERENCES itens(codigo) ON DELETE RESTRICT,
    CONSTRAINT chk_movimentacoes_tipo CHECK (tipo IN ('retirada', 'reposicao')),
    CONSTRAINT chk_movimentacoes_quantidade_positiva CHECK (quantidade > 0),
    CONSTRAINT chk_movimentacoes_turno CHECK (turno IN ('A', 'B', 'C'))
);

-- Índices para otimização de consultas OLTP e filtros frequentes
CREATE INDEX IF NOT EXISTS idx_movimentacoes_item_codigo ON movimentacoes(item_codigo);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tecnico ON movimentacoes(tecnico_matricula);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_turno ON movimentacoes(turno);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data_hora ON movimentacoes(data_hora DESC);
CREATE INDEX IF NOT EXISTS idx_itens_alerta_ruptura ON itens(saldo_atual, saldo_minimo) 
    WHERE saldo_atual <= saldo_minimo;

-- Carga inicial de itens padrão da Metalúrgica Vale do Aço S/A
INSERT INTO itens (codigo, nome, categoria, saldo_atual, saldo_minimo)
VALUES 
    ('BRO-0042', 'Broca Diamantada 12mm', 'Ferramental', 15, 5),
    ('EPI-1001', 'Óculos de Proteção Incolor', 'EPI', 50, 20),
    ('EPI-1002', 'Luva de Vaqueta Cano Curto', 'EPI', 8, 15),
    ('ROL-2030', 'Rolamento Esfera Blindado 6204', 'Rolamentos', 12, 10),
    ('DIS-3001', 'Disco de Corte Inox 4.1/2 Pol', 'Abrasivos', 4, 25)
ON CONFLICT (codigo) DO NOTHING;
