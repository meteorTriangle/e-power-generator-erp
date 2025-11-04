// src/pages/about.tsx

import React from 'react';
import { Typography, Breadcrumb, Divider } from 'antd'; // 匯入 antd 元件
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

// (可選) 將圖片 URL 統一定義在頂部，方便管理
const imageUrl = 'https://img.shoplineapp.com/media/image_clips/5fc9d023b98502003c27f374/original.jpg?1607061539';

// 樣式物件 (Style Objects) - 這是 React 中管理 CSS 的方式之一
const styles: { [key: string]: React.CSSProperties } = {
  // 頁面外層容器，給一個白色背景和內邊距
  pageContainer: {
    padding: '24px 32px', // 上下 24px, 左右 32px
    background: '#fff',
  },
  // 圖片容器
  imageContainer: {
    width: '100%',
    maxHeight: '400px', // 限制最大高度
    overflow: 'hidden',  // 圖片超出部分隱藏
    marginBottom: '24px', // 和下方文字的間距
  },
  // 圖片本身
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover', // 確保圖片填滿容器且不變形
  },
  // 段落文字
  paragraph: {
    fontSize: '16px', // 放大字體，增加易讀性
    lineHeight: 1.8,  // 增加行高
    marginBottom: '20px', // 段落間距
  },
};

const BrandConceptPage: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      {/* 1. 麵包屑導航 (Breadcrumb) - 提高使用者體驗 */}
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/"><HomeOutlined /></Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>品牌理念</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      
      {/* 2. 頁面主標題 */}
      <Title level={2}>品牌理念</Title>
      
      <Divider />

      {/* 3. 主要內容區域 */}
      <div>
        {/* 圖片 */}
        <div style={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt="品牌理念" 
            style={styles.image} 
          />
        </div>

        {/* 文字內容 
          使用 <Typography> 元件 (Paragraph, Text) 
          可以獲得比 <p> <span> 更好的 antd 樣式整合
        */}
        <Paragraph style={styles.paragraph}>
          <Text strong>永續能源．專業．責任</Text>
        </Paragraph>
        
        <Paragraph style={styles.paragraph}>
          E-POWER 發電機成立於2015年，是台灣柴油發電機組專業廠商，我們專注於柴油發電機組、停電、缺電、電力備援、緊急用電設備等領域，提供全方位的解決方案。
        </Paragraph>

        <Paragraph style={styles.paragraph}>
          我們擁有多年的行業經驗和專業知識，致力於為客戶提供高品質、可靠的柴油發電機組。我們的產品廣泛應用於各種場合，包括工業、商業、住宅、醫療、通信等領域，為客戶提供穩定的電力供應。
        </Paragraph>

        <Paragraph style={styles.paragraph}>
          我們的團隊由一群經驗豐富、技術精湛的專業人士組成，他們熟悉各種品牌和型號的柴油發電機組，能夠為客戶提供量身定制的解決方案。我們不僅提供產品銷售，還提供安裝、調試、維修、保養等全方位的服務，確保客戶的設備始終處於最佳狀態。
        </Paragraph>
        
        <Paragraph style={styles.paragraph}>
          我們的服務宗旨是「<Text strong>客戶至上，質量第一</Text>」，我們始終堅持以客戶需求為導向，不斷提升產品質量和服務水平。我們期待與您攜手合作，共創美好未來。
        </Paragraph>

        <Paragraph style={styles.paragraph}>
          如果您對我們的產品或服務有任何疑問或需求，請隨時與我們聯繫，我們將竭誠為您服務。
        </Paragraph>
      </div>
    </div>
  );
};

export default BrandConceptPage;
