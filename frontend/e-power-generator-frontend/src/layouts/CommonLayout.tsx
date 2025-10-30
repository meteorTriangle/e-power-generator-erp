// src/layout/CommonLayout.tsx

import React, { Children, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd'; // 匯入 MenuProps 型別
import './CommonLayout.css'


const { Header, Content } = Layout;

const items: MenuProps['items'] = [
    {
        label: '首頁',
        key: 'home',
    },
    {
        label: '機型介紹',
        key: 'models',
        children: [
            {
                type: 'group',
                label: '發電機',
                children: [
                    {
                        label: '柴油發電機',
                        key: 'diesel-generators',
                    },
                    {
                        label: '汽油發電機',
                        key: 'gasoline-generators',
                    },
                ],
            },
            {
                type: 'group',
                label: '水冷扇',
                children: [
                    {
                        label: '雙北地區',
                        key: 'taipei-fans',
                    },
                    {
                        label: '高雄地區',
                        key: 'kaohsiung-fans',
                    },
                ],
            },
            {
                label: '行動冷氣',
                key: 'mobile-air-conditioners',
            },
            {
                label: '空壓機',
                key: 'air-compressors',
            },
        ],
    },
    {
        label: '所有站點',
        key: 'sites',
    },
    {
        label: '我要詢價',
        key: 'quote',
    },
    {
        label: '案例分享',
        key: 'cases',
    },
    {
        label: '常見問題',
        key: 'faq',
    },
    {
        label: '關於我們',
        key: 'about',
    },
    {
        label: '會員中心',
        key: 'member',
        style: { marginLeft: 'auto' },
    },
    {
        label: <Link to="/login">登入</Link>,
        key: '/login',
        style: { marginLeft: 'left' },
    }
]

const CommonLayout = () => {
  const [current, setCurrent] = useState('home');

  // 2. 處理點擊事件，MenuProps['onClick'] 是 TS 類型
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Layout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            {/* Logo 或標題可以放在這裡 */}
            <div className="logo">
            <img src='src/assets/logo.png' width={"40"}></img>
            </div>

            {/* 3. 核心：Menu 元件 */}
            <Menu
            theme="light" // 主題
            mode="horizontal" // 設置為水平模式
            onClick={onClick}
            selectedKeys={[current]}
            items={items}
            style={{ flex: 1, minWidth: 0 }} // 讓菜單填滿剩餘空間
            />
        </Header>
        <Content style={{ margin: '16px' }}>
            <Outlet />  
        </Content>
    </Layout>
  );
};

export default CommonLayout;