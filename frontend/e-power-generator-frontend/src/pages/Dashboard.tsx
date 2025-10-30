// src/pages/Dashboard.tsx

import React from 'react'; // 1. 匯入 React
import { Typography } from 'antd';

const { Title } = Typography;

// 2. 使用 React.FC
const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Title level={2}>儀表板 (Dashboard)</Title>
      <p>這裡是顯示圖表和關鍵指標的地方。</p>
    </div>
  );
};

export default Dashboard;