// src/features/generators/GeneratorTable.tsx

import React from 'react';
import { Table, Tag, Space, Tooltip } from 'antd';
import type { TableProps } from 'antd'; // 匯入 AntD 的型別
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { Generator, GeneratorStatus } from '../../types/generator'; // 匯入我們定義的型別

// 1. 定義 props 型別
interface GeneratorTableProps {
  loading: boolean;
  data: Generator[];
  onEdit: (record: Generator) => void; // 新增 onEdit prop 並定義型別
  onView: (record: Generator) => void; // 新增 onView prop 並定義型別
}

// 2. 使用 TableProps<Generator> 來精確定義 columns 的型別
const getColumns = (
  onEdit: (record: Generator) => void,
  onView: (record: Generator) => void
): TableProps<Generator>['columns'] => [
  {
    title: '名稱 (Name)',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '型號 (Model)',
    dataIndex: 'model',
    key: 'model',
    fixed: 'left',
    width: 150,
  },
  {
    title: '狀態 (Status)',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status: GeneratorStatus) => { // 3. 幫 render 的參數加上型別
      let color = 'default';
      if (status === '可用') {
        color = 'success';
      } else if (status === '租賃中') {
        color = 'processing';
      } else if (status === '維修中') {
        color = 'error';
      }
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: '功率 (kW)',
    dataIndex: 'powerKW',
    key: 'powerKW',
    width: 100,
    align: 'right',
    sorter: (a, b) => a.powerKW - b.powerKW,
  },
  {
    title: '目前位置',
    dataIndex: 'location',
    key: 'location',
    width: 200,
  },
  {
    title: '操作 (Actions)',
    key: 'action',
    fixed: 'right',
    width: 100,
    align: 'center',
    render: (_, record: Generator) => ( // 4. 幫 record 加上型別
      <Space size="middle">
        <Tooltip title="編輯">
          <a onClick={() => onEdit(record)}><EditOutlined /></a>
        </Tooltip>
        <Tooltip title="查看詳情">
          <a onClick={() => onView(record)}><EyeOutlined /></a>
        </Tooltip>
      </Space>
    ),
  },
];

// 5. 使用 React.FC (Function Component) 並傳入 props 型別
const GeneratorTable: React.FC<GeneratorTableProps> = ({ loading, data, onEdit, onView }) => {
  
  // 將 columns 的定義移入元件內部，這樣它才能存取 props (onEdit, onView)
  const columns = getColumns(onEdit, onView);
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 800 }}
    />
  );
};

export default GeneratorTable;