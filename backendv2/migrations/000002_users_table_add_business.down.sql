-- 移除索引
DROP INDEX IF EXISTS idx_users_company_tax_id;
DROP INDEX IF EXISTS idx_users_user_type;

-- 移除檢查約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_business_required_fields;
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_user_type;

-- 移除欄位
ALTER TABLE users 
DROP COLUMN IF EXISTS company_address,
DROP COLUMN IF EXISTS company_tax_id,
DROP COLUMN IF EXISTS company_name,
DROP COLUMN IF EXISTS user_type;
