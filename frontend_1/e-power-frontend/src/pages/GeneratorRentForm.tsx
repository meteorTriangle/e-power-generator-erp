import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Radio, 
  DatePicker, 
  Space, 
  Divider, 
  Typography,
  Modal,
  Result
} from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PhoneInput from '../components/PhoneInput';
import { rentalService, type RentalRequest } from '../services/rental';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface FormValues {
  full_name: string;
  phone1: string;
  phone2: string;
  need_tax_id: 'yes' | 'no';
  tax_id?: string;
  company_name?: string;
  address: string;
  rental_period?: [Dayjs, Dayjs];
  notes?: string;
}

export default function GeneratorRentForm() {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<RentalRequest | null>(null);
  const navigate = useNavigate();
  const needTaxId = Form.useWatch('need_tax_id', form);

  // 台灣手機號碼驗證 (09開頭，10位數字)
  const validateTaiwanPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+886)?0?9\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // 統一編號驗證 (8位數字，含邏輯驗證)
  const validateTaxId = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }

    // 移除空格和非數字字元
    const taxId = value.replace(/\D/g, '');

    // 檢查是否為8位數字
    if (taxId.length !== 8) {
      return Promise.reject(new Error('統一編號必須為8位數字'));
    }

    // 統一編號邏輯驗證
    const weights = [1, 2, 1, 2, 1, 2, 4, 1];
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      let product = parseInt(taxId[i]) * weights[i];
      // 如果乘積大於9，將十位數和個位數相加
      sum += Math.floor(product / 10) + (product % 10);
    }

    // 檢查驗證碼
    if (sum % 10 === 0 || (taxId[6] === '7' && (sum + 1) % 10 === 0)) {
      return Promise.resolve();
    }

    return Promise.reject(new Error('統一編號格式錯誤，請確認是否正確'));
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // 準備提交資料
      const requestData: RentalRequest = {
        full_name: values.full_name.trim(),
        phone1: values.phone1.trim(),
        phone2: values.phone2.trim(),
        need_tax_id: values.need_tax_id,
        address: values.address.trim(),
        notes: values.notes?.trim() || '',
      };

      // 如果需要統編，加入相關資料
      if (values.need_tax_id === 'yes') {
        requestData.tax_id = values.tax_id?.trim();
        requestData.company_name = values.company_name?.trim();
      }

      // 如果有選擇租期，加入日期
      if (values.rental_period && values.rental_period.length === 2) {
        requestData.rental_period_start = values.rental_period[0].format('YYYY-MM-DD');
        requestData.rental_period_end = values.rental_period[1].format('YYYY-MM-DD');
      }

      // 呼叫 API
      const response = await rentalService.createRental(requestData);
      
      console.log('預約成功:', response);
      
      // 儲存提交的資料
      setSubmittedData(requestData);
      setSubmitSuccess(true);
      
      message.success('預約成功！我們會盡快與您聯繫確認。');
      
      // 清空表單
      form.resetFields();
      
    } catch (err: any) {
      console.error('提交失敗:', err);
      
      // 處理不同的錯誤情況
      if (err.response?.status === 400) {
        message.error(err.response?.data?.message || '資料格式錯誤，請檢查輸入內容');
      } else if (err.response?.status === 401) {
        message.error('請先登入後再預約');
        navigate('/login');
      } else if (err.response?.status === 500) {
        message.error('伺服器錯誤，請稍後再試');
      } else {
        message.error('預約失敗，請稍後再試或聯繫客服');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Modal.confirm({
      title: '確認清除',
      content: '確定要清除所有已填寫的資料嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk: () => {
        form.resetFields();
        message.info('表單已清除');
      },
    });
  };

  const handleCloseSuccessModal = () => {
    setSubmitSuccess(false);
    setSubmittedData(null);
  };

  const handleGoToDashboard = () => {
    setSubmitSuccess(false);
    navigate('/dashboard');
  };

  return (
    <>
      <div style={{ 
        padding: '24px',
        maxWidth: '900px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <Card
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px', fontWeight: 600 }}>
              🔌 E大發電機 高雄區發電機
            </Title>
            <Title level={3} style={{ color: '#595959', fontWeight: 'normal', marginBottom: '16px' }}>
              預約表單
            </Title>
            <Paragraph type="secondary" style={{ fontSize: '14px', margin: 0 }}>
              請填寫以下資料，我們將盡快與您聯繫確認租賃事宜
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
            initialValues={{
              need_tax_id: 'no'
            }}
            scrollToFirstError
          >
            {/* 基本資料區 */}
            <Divider style={{ fontSize: '16px', fontWeight: '600' }}>
              <UserOutlined /> 基本資料
            </Divider>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>姓名 (請填寫身分證上全名)</span>}
              name="full_name"
              rules={[
                { required: true, message: '請輸入您的全名' },
                { min: 2, message: '姓名至少需要2個字' },
                { max: 50, message: '姓名不得超過50個字' },
                {
                  pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
                  message: '姓名只能包含中文、英文和空格'
                },
                { whitespace: true, message: '姓名不能只包含空格' }
              ]}
              tooltip="請填寫與身分證相同的姓名"
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="例：王小明"
                maxLength={50}
                showCount
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>手機號碼 1 (請填寫兩支電話)</span>}
              name="phone1"
              rules={[
                { required: true, message: '請輸入第一支手機號碼' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (validateTaiwanPhone(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('請輸入有效的台灣手機號碼 (09xxxxxxxx)'));
                  }
                }
              ]}
              tooltip="台灣手機號碼，09開頭"
            >
              <PhoneInput placeholder="0912345678" />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>手機號碼 2 (請填寫兩支電話)</span>}
              name="phone2"
              rules={[
                { required: true, message: '請輸入第二支手機號碼' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (validateTaiwanPhone(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('請輸入有效的台灣手機號碼 (09xxxxxxxx)'));
                  }
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('phone1') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('兩支手機號碼不可相同'));
                  },
                }),
              ]}
              tooltip="請提供另一支聯絡電話，不可與第一支相同"
            >
              <PhoneInput placeholder="0987654321" />
            </Form.Item>

            {/* 統編資訊區 */}
            <Divider style={{ fontSize: '16px', fontWeight: '600' }}>
              <FileTextOutlined /> 發票資訊
            </Divider>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>統編?</span>}
              name="need_tax_id"
              rules={[{ required: true, message: '請選擇是否需要統編' }]}
              tooltip="若需要公司抬頭發票請選擇「需要」"
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="yes">需要</Radio.Button>
                <Radio.Button value="no">不需要</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {needTaxId === 'yes' && (
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>統一編號</span>}
                  name="tax_id"
                  rules={[
                    { required: true, message: '請輸入統一編號' },
                    { 
                      pattern: /^\d{8}$/,
                      message: '統一編號必須為8位數字'
                    },
                    { validator: validateTaxId }
                  ]}
                  tooltip="請輸入8位數字的統一編號"
                >
                  <Input
                    prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="12345678"
                    maxLength={8}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>公司名稱</span>}
                  name="company_name"
                  rules={[
                    { required: true, message: '請輸入公司名稱' },
                    { min: 2, message: '公司名稱至少需要2個字' },
                    { max: 100, message: '公司名稱不得超過100個字' },
                    { whitespace: true, message: '公司名稱不能只包含空格' }
                  ]}
                  tooltip="請輸入公司登記的全名"
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="例：臺灣電力股份有限公司"
                    maxLength={100}
                    showCount
                  />
                </Form.Item>
              </div>
            )}

            {/* 租賃資訊區 */}
            <Divider style={{ fontSize: '16px', fontWeight: '600' }}>
              <HomeOutlined /> 租賃資訊
            </Divider>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>使用地址</span>}
              name="address"
              rules={[
                { required: true, message: '請輸入使用地址' },
                { min: 10, message: '請輸入完整地址（至少10個字）' },
                { max: 200, message: '地址不得超過200個字' },
                { whitespace: true, message: '地址不能只包含空格' }
              ]}
              tooltip="請填寫發電機實際使用地址，需含縣市區鄉鎮及詳細地址"
            >
              <Input
                prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="例：高雄市○○區○○路○○號"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>預計租期</span>}
              name="rental_period"
              tooltip="請選擇預計的租賃起訖日期"
            >
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['開始日期', '結束日期']}
                format="YYYY-MM-DD"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => {
                  // 禁用過去的日期
                  return current && current < dayjs().startOf('day');
                }}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    const days = dates[1].diff(dates[0], 'day') + 1;
                    if (days > 0) {
                      message.info(`已選擇 ${days} 天的租期`);
                    }
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>備註</span>}
              name="notes"
              tooltip="如有特殊需求或注意事項，請在此說明"
            >
              <TextArea
                rows={4}
                placeholder="請輸入其他需求或備註事項，例如：
• 發電機規格需求
• 特殊時間要求
• 現場環境說明
• 其他注意事項"
                maxLength={500}
                showCount
              />
            </Form.Item>

            {/* 提交按鈕區 */}
            <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
              <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  icon={<CheckCircleOutlined />}
                  style={{ minWidth: '140px', height: '48px', fontSize: '16px' }}
                >
                  {loading ? '提交中...' : '提交預約'}
                </Button>
                <Button
                  htmlType="button"
                  onClick={handleReset}
                  disabled={loading}
                  size="large"
                  style={{ minWidth: '140px', height: '48px', fontSize: '16px' }}
                >
                  清除表單
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Divider />

          <div style={{ textAlign: 'center' }}>
            <Paragraph type="secondary" style={{ fontSize: '12px', marginBottom: '4px' }}>
              ⚠️ 請勿利用此表單送出密碼或敏感資訊
            </Paragraph>
            <Paragraph type="secondary" style={{ fontSize: '12px', margin: 0 }}>
              若有任何問題，請直接聯繫我們的客服人員
            </Paragraph>
          </div>
        </Card>
      </div>

      {/* 成功提交 Modal */}
      <Modal
        open={submitSuccess}
        onCancel={handleCloseSuccessModal}
        footer={[
          <Button key="close" onClick={handleCloseSuccessModal}>
            關閉
          </Button>,
          <Button key="dashboard" type="primary" onClick={handleGoToDashboard}>
            前往控制台
          </Button>,
        ]}
        width={500}
      >
        <Result
          status="success"
          title="預約提交成功！"
          subTitle={
            <div>
              <Paragraph>
                感謝您的預約！我們已收到您的資料，將在1-2個工作天內與您聯繫確認。
              </Paragraph>
              {submittedData && (
                <div style={{ textAlign: 'left', marginTop: '16px' }}>
                  <Text strong>預約資訊摘要：</Text>
                  <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <div>👤 姓名：{submittedData.full_name}</div>
                    <div>📱 電話：{submittedData.phone1}</div>
                    <div>📍 地址：{submittedData.address}</div>
                    {submittedData.rental_period_start && submittedData.rental_period_end && (
                      <div>📅 租期：{submittedData.rental_period_start} 至 {submittedData.rental_period_end}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          }
        />
      </Modal>
    </>
  );
}
