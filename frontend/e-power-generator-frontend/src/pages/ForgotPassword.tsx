// src/pages/ForgotPassword.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Divider, Button, Typography, Spin, Alert } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import apiClient from '../services/apiClient'; // 我們直接使用 apiClient

const { Title, Text } = Typography;

interface ForgotPasswordFormValues {
  email: string;
}

// 模擬的 API 呼叫函式
// (您可以將其移至 authService.ts 中)
const requestPasswordReset = async (email: string): Promise<unknown> => {
  // 假設 API 端點是 /auth/forgot-password
  // 後端會處理寄送 email 的邏輯
  return apiClient.post('/auth/forgot-password', { email });
};


const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // 'initial': 初始狀態, 'submitted': 已提交狀態
  const [formState, setFormState] = useState<'initial' | 'submitted'>('initial');
  const [userEmail, setUserEmail] = useState(''); // 用於顯示在成功訊息中

  /**
   * 處理表單提交
   */
  const handleFormSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setUserEmail(values.email); // 儲存 email 以便顯示

    try {
      // 呼叫 API
      await requestPasswordReset(values.email);
      
      // 不論成功或失敗 (例如 email 不存在)，
      // 為了安全，我們都顯示一樣的成功訊息
      setFormState('submitted'); // 切換到「已提交」視圖

    } catch (error) {
      // 即使 API 呼叫失敗 (例如伺服器 500 錯誤)，
      // 在這個特定頁面，我們也可能選擇顯示一樣的成功訊息，
      // 避免攻擊者利用此端點探測系統狀態。
      // 但如果只是想提示網路錯誤，可以這樣做：
      // message.error('請求失敗，請稍後再試');
      
      // 這裡我們選擇統一導向到成功狀態
      console.error('Password reset request failed (but hiding from user):', error);
      setFormState('submitted');

    } finally {
      setLoading(false);
    }
  };

  /**
   * 顯示表單
   */
  const renderForm = () => (
    <Spin spinning={loading}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title level={3}>忘記密碼</Title>
        <Text type="secondary">請輸入您註冊的電子郵件地址</Text>
      </div>

      <Form
        name="forgot_password_form"
        onFinish={handleFormSubmit}
        autoComplete="off"
      >
        {/* 電子郵件欄位 */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '請輸入您的電子郵件!' },
            { type: 'email', message: '請輸入有效的電子郵件格式!' },
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="電子郵件地址"
            size="large"
          />
        </Form.Item>

        {/* 提交按鈕 */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ width: '100%' }}
            size="large"
          >
            發送重設密碼郵件
          </Button>
        </Form.Item>

        {/* 返回登入 */}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Link to="/login">
            <ArrowLeftOutlined /> 返回登入
          </Link>
        </Form.Item>
      </Form>
    </Spin>
  );

  /**
   * 顯示提交後的成功訊息
   */
  const renderSubmittedView = () => (
    <div style={{ textAlign: 'center' }}>
      <MailOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '24px' }} />
      <Title level={3}>已發送郵件</Title>
      <Alert
        message={
          <>
            如果 <strong>{userEmail}</strong> 與我們系統中的帳號相符，
            一封包含重設密碼指示的郵件將會寄送給您。
          </>
        }
        type="success"
        showIcon
        style={{ marginBottom: '24px', textAlign: 'left' }}
      />
      <Text type="secondary">
        如果幾分鐘內未收到郵件，請檢查您的垃圾郵件匣。
      </Text>
      <Divider />
      <Link to="/login">
        <Button type="primary" size="large">
          返回登入
        </Button>
      </Link>
    </div>
  );

  return (
    // 1. 頁面容器：與登入頁面使用相同的樣式
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      
      {/* 2. 內容卡片 */}
      <Card style={{ maxWidth: 400, minWidth: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* 根據狀態顯示不同內容 */}
        {formState === 'initial' ? renderForm() : renderSubmittedView()}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
