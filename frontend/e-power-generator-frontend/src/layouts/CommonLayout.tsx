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
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd'; // 匯入 MenuProps 型別
import './CommonLayout.css'
import { LoginButton } from '../components/loginButton';


const { Header, Content } = Layout;

var items: MenuProps['items'] = [
    {
        label: '首頁',
        key: 'home',
    },
    {
        label: '機型介紹',
        key: 'models',
        children: [
            {
                // type: '',
                label: '發電機',
                key: 'generators',
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
                label: '水冷扇',
                key: 'water-coolers',
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
        children: [
            {
                label: '北部',
                key: 'north-sites',
                children: [
                    {
                        label: '新北新莊站',
                        key: 'new-taipei',
                    },
                    {
                        label: '桃園站',
                        key: 'taoyuan',
                    },
                    {
                        label: '新竹竹東站',
                        key: 'hsinchu',
                    },
                ],
            },
            {
                label: '中部',
                key: 'middle-sites',
                children: [
                    {
                        label: '台中北屯站',
                        key: 'taichung',
                    },
                    {
                        label: '雲林虎尾站',
                        key: 'yunlin',
                    },
                ],
            },
            {
                label: '南部',
                key: 'south-sites',
                children: [
                    {
                        label: '台南安南站',
                        key: 'tainan',
                    },
                    {
                        label: '高雄三民站',
                        key: 'kaohsiung',
                    },
                ],
            },
        ],
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
        style: { marginRight: 'auto' },
    },
]

const items_user: MenuProps['items'] = [
    {
        label: '會員中心',
        key: 'member',
        // style: { marginLeft: 'left' },
    },
    LoginButton,
]

const items_admin: MenuProps['items'] = [{
    label: <Link to="/admin">管理系統</Link>,
    key: 'admin',
    // style: { marginLeft: 'auto' },
},]


if (localStorage.getItem('role') == 'admin') {
    items = items.concat( items_admin );  
} 
items = items.concat(items_user);

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
        <Content style={{}}>
            <Outlet />  
        </Content>
    </Layout>
  );
};

export default CommonLayout;