-- 使用者表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    site_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT chk_role CHECK (role IN ('customer', 'employee', 'manager', 'investor', 'admin'))
);

-- 建立索引
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_site_id ON users(site_id) WHERE site_id IS NOT NULL;

-- 新增註解
COMMENT ON TABLE users IS '使用者表';
COMMENT ON COLUMN users.id IS '使用者 ID';
COMMENT ON COLUMN users.role IS '角色: customer, employee, manager, investor, admin';
COMMENT ON COLUMN users.site_id IS '所屬站點 ID (員工/站長)';