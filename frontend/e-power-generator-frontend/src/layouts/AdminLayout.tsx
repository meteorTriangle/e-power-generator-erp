// src/layouts/AdminLayout.tsx

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd'; // 匯入 MenuProps 型別
import { DashboardOutlined, DatabaseOutlined } from '@ant-design/icons';
import './AdminLayout.css'
import { AiOutlineOrderedList } from "react-icons/ai";

const { Header, Content, Sider } = Layout;

// 1. 為 menuItems 加上型別
const menuItems: MenuProps['items'] = [
  {
    key: '/', 
    icon: <DashboardOutlined />,
    label: <Link to="">儀表板</Link>, 
  },
  {
    key: '/manager',
    icon: <DatabaseOutlined />,
    label: <Link to="manager">庫存管理</Link>,
  },
  {
    label: <Link to='order'><AiOutlineOrderedList /> 訂單管理</Link>,
    key: '/order-manager',
    children: [
      {
        label: '訂單列表',
        key: '/order-list',
      },
      {
        label: '訂單統計',
        key: '/order-statistics',
      },
    ],
  },
];

// 2. 使用 React.FC
const AdminLayout: React.FC = () => {
  
    
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light" >
        <Menu 
          theme="light" 
          mode="inline" 
          selectedKeys={[location.pathname]}
          items={menuItems} 
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;