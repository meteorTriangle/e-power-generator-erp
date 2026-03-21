import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您訪問的頁面不存在。"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首頁
          </Button>
        }
      />
    </div>
  );
}
