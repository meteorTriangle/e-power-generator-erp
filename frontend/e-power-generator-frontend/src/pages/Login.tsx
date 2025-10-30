import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { login } from '../services/authService'; // 匯入 service
import type { AxiosError } from 'axios';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// ... (LoginFormValues 介面, JSX...)

const { Title } = Typography;

// 這是 antd Form 的 onFinish 函式會收到的型別
interface LoginFormValues {
	email: string;
	password: string;
}

const LoginPage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	/**
	 * 這裡就是「事件處理器」，不是 useEffect
	 * 它會在使用者點擊 "登入" 按鈕且表單驗證通過後才被呼叫
	 */
	const handleLogin = async (values: LoginFormValues) => {
		setLoading(true);
		try {
			// 呼叫 API
			// authService 內部會使用 apiClient
			// apiClient 會請求 /api/v1/auth/login
			// Proxy 會攔截此請求，並轉發到 http://localhost:8080/api/v1/auth/login
			const response = await login(values);

			// 登入成功
			//   localStorage.setItem('authToken', response.token); 
			message.success('登入成功！');
			navigate('/');

		} catch (err) {
			// 登入失敗
			const error = err as AxiosError<{ message?: string }>;
			// ... (錯誤處理)
			message.error(error.response?.data?.message || '登入失敗');
			setLoading(false);
		}
	};
	const onFinishFailed = (errorInfo: any) => {
		console.log('表單驗證失敗:', errorInfo);
	};

	return (
		// 1. 頁面容器：使用 flex 佈局讓 Card 垂直和水平居中
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			minHeight: '100vh', // 佔滿整個視窗高度
			minWidth: '100vw',
			background: '#f0f2f5', // 淺灰色背景
		}}>

			{/* 2. 登入卡片 */}
			<Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
				<div style={{ textAlign: 'center', marginBottom: '24px' }}>
					<Title level={2}><img src="/src/assets/logo.png"></img></Title>

				</div>

				{/* 3. 登入表單 */}
				<Form
					name="login_form"
					initialValues={{ remember: true }}
					onFinish={handleLogin} // 驗證成功後提交
					onFinishFailed={onFinishFailed} // 驗證失敗後
					autoComplete="off"
				>
					{/* 帳號欄位 */}
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: '請輸入您的e-mail!' },
						]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="E-mail"
							size="large"
						/>
					</Form.Item>

					{/* 密碼欄位 */}
					<Form.Item
						name="password"
						rules={[
							{ required: true, message: '請輸入您的密碼!' },
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="密碼"
							size="large"
						/>
					</Form.Item>

					{/* 登入按鈕 */}
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading} // 綁定 loading 狀態
							style={{ width: '100%' }}
							size="large"
						>
							登入
						</Button>
					</Form.Item>
					<div 
						style={{ display: 'flex', justifyContent: 'space-between' }}
					>
						<Button
							style={{ marginRight: '8px' }}	
							type="link"
							onClick={() => navigate('/forgot-password')}
						>
							忘記密碼?
						</Button>
						<Button
							type="link"
							onClick={() => navigate('/register')}
							style={{ marginRight: '8px' }}
						>
							註冊新帳號
						</Button>
					</div>
				</Form>
			</Card>
		</div>
	);



};

export default LoginPage;
