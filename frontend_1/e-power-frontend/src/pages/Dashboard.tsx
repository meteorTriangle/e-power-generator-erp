import { Card, Descriptions, Avatar, Row, Col, Statistic } from 'antd';
import { UserOutlined, ThunderboltOutlined, TeamOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="總發電機數"
              value={28}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="租賃中"
              value={15}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="維護中"
              value={3}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="總客戶數"
              value={42}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="用戶資訊" 
        style={{ marginTop: 24 }}
        extra={<Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />}
      >
        {user && (
          <Descriptions column={{ xs: 1, sm: 2, md: 2 }} bordered>
            <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
            <Descriptions.Item label="用戶ID">{user.id}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
}
