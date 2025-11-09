// src/layout/CommonLayout.tsx


import { useState, type FC } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import {
    LoginOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd'; // 匯入 MenuProps 型別
import './CommonLayout.css'
import { useAuth } from '../hooks/useAuth.ts';
import logo from '../assets/logo.png';


const { Header, Content,  } = Layout;

const CommonLayout: FC = () => {
    const [current, setCurrent] = useState('home');
    const { logout, user, isLoading } = useAuth();
    const navigate = useNavigate();


    const authItem = () => {
        if (isLoading) {
            return ({
                key: 'authLoadinga',
                label: <Spin size="small" />, 
                disabled: true,
            })
        }
        if (user) {
            return ({
                key: '/logout',
                icon: <LogoutOutlined />,
                label: `登出`, // 顯示使用者名稱
                onClick: () => {
                    logout();
                    navigate('/'); // 登出後導向到登入頁
                },
            })
        } else {
            return ({
                key: '/login',
                icon: <LoginOutlined />,
                label: '登入',
                onClick: () => navigate('/login'),
            })  
        }

    };

    // 2. 處理點擊事件，MenuProps['onClick'] 是 TS 類型
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    const items_admin = () => {
        const returnValue = ({
                    label: <Link to="/admin">管理系統</Link>,
                    key: 'admin',
                });
        if (isLoading){
            return {
                key: 'authLoadingi',
                label: <Spin size="small" />, 
                disabled: true,
            };
        }
        if (!user){
            return null;
        }
        if(user.role != 'customer'){
            return returnValue;
        } else {
            return null;
        };
    }

    

    const items: MenuProps['items'] = [
    {
        label: <Link to="/">首頁</Link>,
        key: 'home',
    },
    {
        label: '機型介紹',
        key: 'models',
        children: [
            {
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
        label: <Link to="/about">關於我們</Link>,
        key: 'about',
        style: { marginRight: 'auto' },
    },
    items_admin(),
    {
        label: '會員中心',
        key: 'member',
    },
    authItem(),

]



    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
                {/* Logo 或標題可以放在這裡 */}
                <div className="logo">
                    <img
                        src={logo}
                        alt="Logo"
                        // preview={false}
                        
                        width={"40"}
                    />
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