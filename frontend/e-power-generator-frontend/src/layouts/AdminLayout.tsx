// src/layouts/AdminLayout.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Drawer, Button } from 'antd';
import type { MenuProps } from 'antd'; // 匯入 MenuProps 型別
import { GiPowerGenerator } from "react-icons/gi";
import { DeviceSelect } from '../router/mobilePCRoute';

import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  OrderedListOutlined,
  FundOutlined,
  ShoppingOutlined,
  ToolOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import './AdminLayout.css'
import { MdStore } from 'react-icons/md'

const { Content, Sider } = Layout;

// 1. 為 menuItems 加上型別
const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: <Link to="">儀表板</Link>,
  },
  {
    key: '/order-operation',
    icon: <BookOutlined />,
    label: <Link to="order-operation">訂單操作</Link>,
  },
  {
    key: '/product-manager',
    icon: <ShoppingOutlined />,
    label: "商品管理",
    children: [
      {
        key: 'generator-product-manager',
        label: <Link to="generator-product-manager">發電機機型管理</Link>,
      },
    ],
  },
  {
    key: '/machine-manager',
    icon: <GiPowerGenerator />,
    label: <Link to="machine-manager">發電機管理</Link>,
  },
  {
    key: '/site-manager',
    icon: <MdStore />,
    label: <Link to="site-manager">站點管理</Link>,
  },
  {
    key: '/account',
    icon: <UserOutlined />,
    label: <Link to="account">帳號管理</Link>,
    children: [
      {
        label: '客戶列表',
        key: '/customer-list',
      },
      {
        label: '管理員列表',
        key: '/admin-list',
      },
    ],
  },
  {
    key: '/maintance',
    icon: <ToolOutlined />,
    label: <Link to="maintance">機器養護</Link>,
  },
  {
    key: '/business',
    icon: <FundOutlined />,
    label: <Link to="business">財務管理</Link>,
  },
  {
    label: <Link to='order'> 訂單管理</Link>,
    key: '/order-manager',
    icon: <OrderedListOutlined />,
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
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const showDrawer = () => setVisibleDrawer(true);
  const closeDrawer = () => setVisibleDrawer(false);
  const location = useLocation();

  const adminMenu = <Menu
    theme="light"
    mode="inline"
    selectedKeys={[location.pathname]}
    items={menuItems}
    onClick={closeDrawer}
  />


  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>

        <DeviceSelect deviceType={['mobile', 'tablet']}>
          <Drawer
            open={visibleDrawer}
            onClose={closeDrawer}
            placement="left"
          >
            {adminMenu}
          </Drawer>
        </DeviceSelect>

        <DeviceSelect deviceType={['laptop', 'desktop']}>
          <Sider
            collapsible={false}
            theme="light"
          >
            {adminMenu}
          </Sider>
        </DeviceSelect>

        <Layout>
          <Content style={{ margin: '16px' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <DeviceSelect deviceType={['mobile', 'tablet']}>
        {visibleDrawer ? null : ReactDOM.createPortal(
          <Button
            style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 9999 }}
            onClick={showDrawer}
          >
            <MenuOutlined />
          </Button>, document.body)}
      </DeviceSelect>
    </>
  );
};



export default AdminLayout;