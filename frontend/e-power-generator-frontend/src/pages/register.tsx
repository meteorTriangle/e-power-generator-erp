import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Image } from 'antd';
// import { register } from '../services/authService'; // 匯入 service
// import type { AxiosError } from 'axios';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
// import styles from './Login.module.css';
import logo from '../assets/logo.png';
import ValidateErrorEntity from 'rc-field-form/lib/interface';
import apiClient,{type AxiosError } from '../services/apiClient';
import styles from './Login.module.css';

// ... (LoginFormValues 介面, JSX...)

const { Title } = Typography;

// 這是 antd Form 的 onFinish 函式會收到的型別
interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    tel: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [ message, setMessage ] = useState<string | null>(null);

    /**
     * 這裡就是「事件處理器」，不是 useEffect
     * 它會在使用者點擊 "登入" 按鈕且表單驗證通過後才被呼叫
     */
    const handleRegister = async (values: RegisterFormValues) => {
        setError(null);
        setLoading(true);
        // check password and password_confirm match
        if (values.password !== values.password_confirm) {
            setError('密碼和確認密碼不匹配');
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.post('/register', values)
            console.log('註冊成功:', response.data);
            // display success message and receive email verification instruction
            setMessage('註冊成功! 請前往您的電子郵件信箱以完成驗證程序。');
            setLoading(false);

        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            setError(error.response?.data?.message || '登入失敗');
            setLoading(false);
        }
    };
    const onFinishFailed = (errorInfo: ValidateErrorEntity.ValidateErrorEntity<RegisterFormValues>) => {
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
            marginTop: '24px',
            marginBottom: '24px',
        }}>

            <Card style={{ maxWidth: 400, minWidth: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}><Image
                        src={logo}
                        alt="Logo"
                        preview={false}
                        width={"40"}
                    ></Image></Title>

                </div>

                {/* 3. 登入表單 */}
                <Form
                    name="register_form"
                    initialValues={{ remember: true }}
                    onFinish={handleRegister} // 驗證成功後提交
                    onFinishFailed={onFinishFailed} // 驗證失敗後
                    autoComplete="off"
                >
                    {/* 姓名欄位 */}
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '請輸入您的姓名' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="姓名"
                            size="large"
                        />
                    </Form.Item>
                    {/* 電話欄位 */}
                    <Form.Item
                        name="tel"
                        rules={[
                            { required: true, message: '請輸入您的電號碼' },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="電話號碼"
                            size="large"
                        />
                    </Form.Item>

                    {/* 帳號欄位 */}
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '請輸入您的E-mail' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
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

                    {/* 確認密碼欄位 */}
                    <Form.Item
                        name="password_confirm"
                        rules={[
                            { required: true, message: '請再次輸入您的密碼!'},
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="確認密碼"
                            size="large"
                        />
                    </Form.Item>
                        
					{error && (
						<div className={styles.errorAlert}>
							{error}
						</div>
					)}
                    {message && (
						<div className={styles.successAlert}>
							{message}
						</div>
					)}
                    {/* 註冊按鈕 */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading} // 綁定 loading 狀態
                            style={{ width: '100%' }}
                            size="large"
                        >
                            註冊
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
                            onClick={() => navigate('/login')}
                            style={{ marginRight: '8px' }}
                        >
                            已經有帳號了? 前往登入
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );



};

export default RegisterPage;
