--發電機型號表
CREATE TABLE IF NOT EXISTS generator_models (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    power_output DECIMAL(10, 2) NOT NULL,
    voltage VARCHAR(50) NOT NULL,
    phase VARCHAR(10) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    fuel_tank_capacity DECIMAL(10, 2) NOT NULL,
    deposit_price DECIMAL(10, 2) NOT NULL,
    rent_price DECIMAL(10, 2) NOT NULL,
    run_time_hours DECIMAL(10, 2) NOT NULL,
    others JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_power_output CHECK (power_output > 0),
    CONSTRAINT chk_fuel_tank_capacity CHECK (fuel_tank_capacity > 0),
    CONSTRAINT chk_deposit_price CHECK (deposit_price >= 0),
    CONSTRAINT chk_rent_price CHECK (rent_price >= 0),
    CONSTRAINT chk_run_time_hours CHECK (run_time_hours >= 0),
    CONSTRAINT chk_phase CHECK (phase IN ('single', 'three')),
    CONSTRAINT chk_fuel_type CHECK (fuel_type IN ('diesel', 'gasoline'))

);

-- 建立索引
CREATE INDEX idx_generator_models_name ON generator_models(name);
CREATE INDEX idx_generator_models_power_output ON generator_models(power_output);
CREATE INDEX idx_generator_models_fuel_type ON generator_models(fuel_type);

-- 新增註解
COMMENT ON TABLE generator_models IS '發電機型列表';
COMMENT ON COLUMN generator_models.id IS '機型 ID';
COMMENT ON COLUMN generator_models.name IS '機型名稱';
COMMENT ON COLUMN generator_models.description IS '機型描述';
COMMENT ON COLUMN generator_models.power_output IS '發電功率 (kW)';
COMMENT ON COLUMN generator_models.voltage IS '發電機電壓 (V)';
COMMENT ON COLUMN generator_models.phase IS '發電機相位 (single/three)';
COMMENT ON COLUMN generator_models.fuel_type IS '燃料類型 (diesel/gasoline)';
COMMENT ON COLUMN generator_models.fuel_tank_capacity IS '油箱容量 (L)';
COMMENT ON COLUMN generator_models.deposit_price IS '押金價格 (NT$)';
COMMENT ON COLUMN generator_models.rent_price IS '租金價格 (NT$)';
COMMENT ON COLUMN generator_models.run_time_hours IS '滿油運轉時間 (小時)';
COMMENT ON COLUMN generator_models.others IS '其他資訊 (JSON)';
