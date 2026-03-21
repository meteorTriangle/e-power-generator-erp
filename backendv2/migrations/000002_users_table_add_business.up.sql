-- 新增商業用戶相關欄位
ALTER TABLE users 
ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'individual',
ADD COLUMN company_name VARCHAR(200),
ADD COLUMN company_tax_id VARCHAR(20),
ADD COLUMN company_address TEXT;

-- 新增檢查約束：user_type 只能是 individual 或 business
ALTER TABLE users 
ADD CONSTRAINT chk_user_type CHECK (user_type IN ('individual', 'business'));

-- 新增檢查約束：如果是 business 類型，必須填寫公司抬頭和統編
ALTER TABLE users 
ADD CONSTRAINT chk_business_required_fields 
CHECK (
    (user_type = 'individual') OR 
    (user_type = 'business' AND company_name IS NOT NULL AND company_tax_id IS NOT NULL)
);

-- 建立索引
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_company_tax_id ON users(company_tax_id) WHERE company_tax_id IS NOT NULL;

-- 新增註解
COMMENT ON COLUMN users.user_type IS '用戶類型: individual (個人), business (商業)';
COMMENT ON COLUMN users.company_name IS '公司抬頭 (商業用戶)';
COMMENT ON COLUMN users.company_tax_id IS '公司統編 (商業用戶)';
COMMENT ON COLUMN users.company_address IS '公司地址 (商業用戶)';
