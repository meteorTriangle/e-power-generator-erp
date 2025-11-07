// src/features/generators/GeneratorModelTable.tsx

import React, { useState, useEffect } from 'react';
import { Typography, Button, Space, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type {
    GeneratorModel,
    GeneratorModelSpec
} from "../../types/generatorModel"
import GeneratorModelTable from '../../features/generators/GeneratorModelTable';



const { Title } = Typography;

const MOCKSPECS: GeneratorModelSpec[] = [
    { SpecName: '電壓(V)', SpecValue: '110' },
    { SpecName: '燃料類型', SpecValue: '92汽油' },
    { SpecName: '油箱容量(L)', SpecValue: '7.8' },
    { SpecName: '運轉時間(hr)', SpecValue: '5' },
    { SpecName: '重量(kg)', SpecValue: '33' },
    

]

// 1. 讓 MOCK_GENERATORS 遵從 Generator 陣列型別
const MOCK_GENERATORS: GeneratorModel[] = [
  { ID: 1, Name: 'E-3600W', Power: 3600, spec: MOCKSPECS, SpecImgPath: '/src/assets/logo.png', MachineImgPath: '/src/assets/3600.webp' },
];

// 2. 使用 React.FC (Functional Component)
const GeneratorModelList: React.FC = () => {
  // 3. 為 useState 加上泛型
  const [generatorModels, setGeneratorModels] = useState<GeneratorModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, ] = useState<string | null>(null); // state 可以是 string 或 null

  // 模擬資料獲取
  useEffect(() => {
    // 未來 API 呼叫的範例 (假設使用 axios)
    // const fetchGenerators = async () => {
    //   try {
    //     setLoading(true);
    //     // 假設 axios 回傳的 data 型別是 Generator[]
    //     const response = await axios.get<Generator[]>('/api/v1/generators');
    //     setGenerators(response.data);
    //     setError(null);
    //   } catch (err: any) {
    //     setError("讀取資料失敗：" + (err.message || '未知錯誤'));
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchGenerators();

    // --- 目前，我們先用 setTimeout 模擬 1 秒的網路延遲 ---
    const timer = setTimeout(() => {
      setGeneratorModels(MOCK_GENERATORS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 處理新增
  const handleAddNew = () => {
    console.log('TODO: Open Add New Generator Modal');
  };

  // 處理編輯 (從 Table 傳上來)
  const handleEdit = (record: GeneratorModel) => {
    console.log('Edit record:', record);
    // TODO: 開啟編輯用的 Modal，並帶入 record 資料
  };

  // 處理查看 (從 Table 傳上來)
  const handleView = (record: GeneratorModel) => {
    console.log('View record:', record);
    // TODO: 開啟唯讀的 Modal 或跳轉到詳情頁
  };

  if (error) {
    return <Alert message="錯誤" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            發電機庫存管理
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            新增發電機
          </Button>
        </div>

        <GeneratorModelTable 
          data={generatorModels} 
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
        />

      </Space>
    </div>
  );
};

export default GeneratorModelList;