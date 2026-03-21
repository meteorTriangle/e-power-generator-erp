import { Card, Descriptions, Avatar, Button, Space } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function UserInfo() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <h2 style={{ margin: 0 }}>{user.name || t('common.user') || '用戶'}</h2>
              <span style={{ color: '#666' }}>{user.email}</span>
            </div>
          </Space>
        }
        extra={
          <Button type="primary" icon={<EditOutlined />}>
            {t('common.edit') || '編輯'}
          </Button>
        }
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t('common.username') || '用戶名'}>
            {user.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.email') || '電子郵件'}>
            {user.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.role') || '角色'}>
            {user.role || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.userId') || '用戶ID'}>
            {user.id}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
