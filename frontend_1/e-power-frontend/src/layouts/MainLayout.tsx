import { Layout, Menu, Avatar, Dropdown, Space, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// get user role from auth context to conditionally render menu items

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '設定',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      onClick: handleLogout,
      danger: true,
    },
  ];
  // get user role from auth context to conditionally render menu items
  const menuItems: MenuProps['items'] = [
    user?.role === 'admin' ? {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '儀表板',
      onClick: () => navigate('/dashboard'),
    } : null,
    user?.role === 'admin' ? {
      key: '/generators',
      icon: <ThunderboltOutlined />,
      label: '發電機管理',
      onClick: () => navigate('/generators'),
    } : null,
    user?.role === 'admin' ? {
      key: '/users',
      icon: <UserOutlined />,
      label: '用戶管理',
      onClick: () => navigate('/users'),
    } : null,
    user?.role === 'customer' ? {
      key: '/rental',
      icon: <ThunderboltOutlined />,
      label: '發電機租借表單',
      onClick: () => navigate('/rental'),
    } : null,
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: 64, 
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '20px' : '18px',
          fontWeight: 'bold',
        }}>
          {collapsed ? 'EP' : 'E-Power'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            {collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: '18px', cursor: 'pointer' }}
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: '18px', cursor: 'pointer' }}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ 
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: 8,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
