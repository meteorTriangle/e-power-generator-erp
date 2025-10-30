// src/layouts/AdminLayout.tsx

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd'; // 匯入 MenuProps 型別
import { DashboardOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

// 1. 為 menuItems 加上型別
const menuItems: MenuProps['items'] = [
  {
    key: '/', 
    icon: <DashboardOutlined />,
    label: <Link to="/">儀表板</Link>, 
  },
  {
    key: '/inventory',
    icon: <DatabaseOutlined />,
    label: <Link to="/inventory">庫存管理</Link>,
  },
];

// 2. 使用 React.FC
const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' , minWidth: '100vw'}}>
      <Sider collapsible>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu 
          theme="light" 
          mode="inline" 
          selectedKeys={[location.pathname]}
          items={menuItems} 
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;