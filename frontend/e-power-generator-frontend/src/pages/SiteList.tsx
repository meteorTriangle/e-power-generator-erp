// src/pages/SiteList.tsx

import React, { useState, useEffect } from 'react';
import SiteTable from '../features/sites/SiteTable';
import { Typography, Button, Space, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Site } from '../types/site'; // 匯入我們定義的型別
import apiClient from '../services/apiClient';
import EditSiteModal from '../components/siteEditModalComponent';

const { Title } = Typography;

// 1. 讓 MOCK_GENERATORS 遵從 Generator 陣列型別


// 2. 使用 React.FC (Functional Component)
const SiteList: React.FC = () => {
  // 3. 為 useState 加上泛型
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // state 可以是 string 或 null
  const [edit, setEdit] = useState<boolean>(false);
  const [record, setRecord] = useState<Site>({ ID: 0 } as Site);
  const [type, setType] = useState<string>('add');

  // const [isModalVisibleRecord] = useState<Site>({ ID: 0 } as Site);

  const fetchSites = async () => {
    try {
      setLoading(true);
      // 假設 axios 回傳的 data 型別是 Generator[]
      const response = await apiClient.get<Site[]>('/site/listall');
      setSites(response.data);
      setError(null);
    } catch (err: unknown) {
      setError("讀取資料失敗：" + (err || '未知錯誤'));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSites();
    return;
  }, []);



  // 處理編輯 (從 Table 傳上來)
  const handleEdit = (record: Site) => {
    setRecord(record);
    setEdit(true);
    setType('edit');
  };
  const handleAdd = () => {
    setRecord({ ID: 0, Contact: [{"Way":"","Value":""}] } as Site);
    setEdit(true);
    setType('add');
  };


  // 處理查看 (從 Table 傳上來)
  const handleView = (record: Site) => {
    console.log('View record:', record);
    // TODO: 開啟唯讀的 Modal 或跳轉到詳情頁
  };

  if (error) {
    return <Alert message="錯誤" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>

        <EditSiteModal
          onRefresh={fetchSites}
          record={record}
          edit={edit}
          setEdit={setEdit}
          type={type}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            站點管理
          </Title>
          {/* <AddSiteModal
            onRefresh={fetchSites}
          /> */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增站點
          </Button>
        </div>

        <SiteTable
          data={sites}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
        />

      </Space>
    </div>
  );
};

export default SiteList;