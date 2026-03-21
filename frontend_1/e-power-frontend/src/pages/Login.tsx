import React from 'react';
import logo from '../assets/logo.png';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import type { LoginRequest, RegisterRequest } from '../services/auth';

type FormType = 'login' | 'register' | 'forgot';

export default function Login() {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formType, setFormType] = React.useState<FormType>('login');
  const { t, i18n } = useTranslation();
  const CompanyName = Form.useWatch('company_name', registerForm);
  const CompanyTaxId = Form.useWatch('company_tax_id', registerForm);

  React.useEffect(() => {
    if (CompanyName || CompanyTaxId) {
      registerForm.setFieldsValue({ user_type: 'business' });
    } else {
      registerForm.setFieldsValue({ user_type: 'individual' });
    }
  }, [CompanyName, CompanyTaxId, registerForm]);

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await login(values);
      message.success(t('common.loginSuccess'));
      navigate('/userinfo');
    } catch (err: any) {
      message.error(err.response?.data?.message || t('common.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      await register(values);
      message.success(t('common.registerSuccess'));
      navigate('/userinfo');
    } catch (err: any) {
      message.error(err.response?.data?.message || t('common.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      // TODO: 實作忘記密碼API
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(t('common.resetPasswordSuccess'));
      setFormType('login');
    } catch (err: any) {
      message.error(t('common.resetPasswordFailed'));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const switchForm = (type: FormType) => {
    setFormType(type);
    loginForm.resetFields();
    registerForm.resetFields();
    forgotForm.resetFields();
  };

  const getCardTitle = () => {
    switch (formType) {
      case 'login':
        return t('login.title');
      case 'register':
        return t('register.title');
      case 'forgot':
        return t('forgotPassword.title');
    }
  };

  const getCardSubtitle = () => {
    switch (formType) {
      case 'login':
        return t('login.subtitle');
      case 'register':
        return t('register.subtitle');
      case 'forgot':
        return t('forgotPassword.subtitle');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'white'
    }}>
      <Card 
        style={{ 
          width: 450, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        {/* 頂部語言選擇 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 20 
        }}>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
          <Select
            value={i18n.language}
            onChange={changeLanguage}
            style={{ width: 120 }}
            suffixIcon={<GlobalOutlined />}
          >
            <Select.Option value="zh-TW">繁體中文</Select.Option>
            <Select.Option value="en-US">English</Select.Option>
          </Select>
        </div>

        {/* 標題區域 */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{getCardTitle()}</h2>
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 14 }}>{getCardSubtitle()}</p>
        </div>

        {/* 表單容器 - 使用滑動效果 */}
        <div style={{ 
          position: 'relative',
          overflow: 'hidden',
          minHeight: 300
        }}>
          <div style={{ 
            display: 'flex',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: formType === 'login' 
              ? 'translateX(0%)' 
              : formType === 'register' 
              ? 'translateX(-100%)' 
              : 'translateX(-200%)',
          }}>
            {/* 登入表單 */}
            <div style={{ minWidth: '100%', paddingRight: 0 }}>
              <Form
                form={loginForm}
                name="login"
                onFinish={handleLogin}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="identifier"
                  rules={[
                    { required: true, message: t('validation.emailRequired') },
                    { type: 'email', message: t('validation.emailInvalid') }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder={t('common.email')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: t('validation.passwordRequired') }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('common.password')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    block
                    size="large"
                  >
                    {t('common.login')}
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button
                  type="link"
                  onClick={() => switchForm('forgot')}
                  style={{ padding: 0, marginBottom: 8 }}
                >
                  {t('common.forgotPasswordText')}
                </Button>
                <div>
                  <span style={{ color: '#666' }}>{t('common.noAccount')} </span>
                  <Button
                    type="link"
                    onClick={() => switchForm('register')}
                    style={{ padding: 0 }}
                  >
                    {t('common.register')}
                  </Button>
                </div>
              </div>
            </div>

            {/* register form */}
            <div style={{ minWidth: '100%', paddingRight: 0 }}>
              <Form
                form={registerForm}
                name="register"
                onFinish={handleRegister}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: t('validation.nameRequired') }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder={t('common.name')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: t('validation.emailRequired') },
                    { type: 'email', message: t('validation.emailInvalid') }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder={t('common.email')}
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: t('validation.phoneRequired') },
                    { pattern: /^\+[1-9]\d{1,14}$/, message: t('validation.phoneInvalid') }
                  ]}
                >
                  <PhoneInput 
                    placeholder={t('common.phone')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: t('validation.passwordRequired') },
                    { min: 6, message: t('validation.passwordMinLength') }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('common.password')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm_password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: t('validation.confirmPasswordRequired') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('validation.passwordNotMatch')));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('common.confirmPassword')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item 
                  name="company_name"
                  // if user_type is business, then company_name is required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue('user_type') === 'business' && !value) {
                          return Promise.reject(new Error(t('validation.companyNameRequired')));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                  >
                  <Input 
                    placeholder={t('common.companyName')}
                    size="large"
                  />
                </Form.Item>
                <Form.Item 
                  name="company_tax_id"
                  // if user_type is business, then company_tax_id is required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue('user_type') === 'business' && !value) {
                          return Promise.reject(new Error(t('validation.companyTaxIdRequired')));
                        }
                        if (value && !/^\d{8}$/.test(value)) {
                          return Promise.reject(new Error(t('validation.companyTaxIdInvalid')));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                  >
                  <Input 
                    placeholder={t('common.companyTaxId')}
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item 
                  name="user_type" 
                  initialValue="individual" 
                  hidden
                  // if company_name or company_tax_id is filled, then user_type auto set to business
                  // if company_name and company_tax_id are empty, then user_type auto set to individual
                  
                >
                  <Select 
                    options={[
                      { label: 'Individual', value: 'individual' },
                      { label: 'Business', value: 'business' }
                    ]}
                    placeholder={t('common.userType')}
                    size="large"
                  >
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    block
                    size="large"
                  >
                    {t('common.register')}
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ color: '#666' }}>{t('common.haveAccount')} </span>
                <Button
                  type="link"
                  onClick={() => switchForm('login')}
                  style={{ padding: 0 }}
                >
                  {t('common.login')}
                </Button>
              </div>
            </div>

            {/* 忘記密碼表單 */}
            <div style={{ minWidth: '100%', paddingRight: 0 }}>
              <Form
                form={forgotForm}
                name="forgot"
                onFinish={handleForgotPassword}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: t('validation.emailRequired') },
                    { type: 'email', message: t('validation.emailInvalid') }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder={t('common.email')}
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    block
                    size="large"
                  >
                    {t('common.submit')}
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button
                  type="link"
                  onClick={() => switchForm('login')}
                  style={{ padding: 0 }}
                >
                  {t('common.backToLogin')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
