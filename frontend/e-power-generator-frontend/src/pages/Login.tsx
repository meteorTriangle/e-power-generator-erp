import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, Typography } from 'antd';
import { isAxiosError } from 'axios';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';
import styles from './Login.module.css';



// ... (LoginFormValues 介面, JSX...)

const { Title } = Typography;


// 這是 antd Form 的 onFinish 函式會收到的型別
// interface LoginFormValues {
// 	email: string;
// 	password: string;
// }

const LoginPage: React.FC = () => {
	// form status
	const [useremail, setEmail] = useState('');
	const [password, setPassword] = useState('');

	//UI status
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null); 

	// routes and authentication
	const { login } = useAuth(); 
	const navigate = useNavigate();
	const location = useLocation();

	// get redirect path
	const from = location.state?.from?.pathname || '/';


	/**
	 * 這裡就是「事件處理器」，不是 useEffect
	 * 它會在使用者點擊 "登入" 按鈕且表單驗證通過後才被呼叫
	 */
	const handleLogin = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// 呼叫 API
			// authService 內部會使用 apiClient
			// apiClient 會請求 /api/v1/auth/login
			// Proxy 會攔截此請求，並轉發到 http://localhost:8080/api/v1/auth/login
			const response = await apiClient.post('/auth/login', {
				email: useremail,
				password,
			});

			const { access_token, username, role, email, group, email_verified } = response.data;
			const user = { username, email, role, group, email_verified };

			if (!access_token || !user) {
				throw new Error("登入回應中缺少 'access_token' 或 'user' 資料");
			}
			login(user, access_token);

			navigate(from, { replace: true });

		} catch (err) {
			// 10. 處理 API 錯誤
			setIsLoading(false); // 請求失敗，停止載入
			if (isAxiosError(err) && err.response) {
				// 抓取後端回傳的錯誤訊息
				// (例如: "invalid credentials", "email not verified")
				setError(err.response.data.error || '登入失敗，請檢查帳號或密碼');
			} else {
				// 處理其他非預期的 JS 錯誤
				setError('發生未預期的錯誤，請稍後再試');
			}
		}
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
			<Card style={{ maxWidth: 400, minWidth: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
				<div style={{ textAlign: 'center', marginBottom: '24px' }}>
					<Title level={2}><img src="/src/assets/logo.png"></img></Title>

				</div>

				{/* 3. 登入表單 */}
				<Form
					name="login_form"
					initialValues={{ remember: true }}
					onFinish={handleLogin} // 驗證成功後提交
					// onFinishFailed={onFinishFailed} // 驗證失敗後
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
							onChange={(values) => setEmail(values.target.value)}
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
							onChange={(values) => setPassword(values.target.value)}
						/>
					</Form.Item>
						{error && (
							<div className={styles.errorAlert}>
								{error}	
							</div>
						)}
					{/* 登入按鈕 */}
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={isLoading} // 綁定 loading 狀態
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
							onClick={() => navigate('/forgotpassword')}
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
