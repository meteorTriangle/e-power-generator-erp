// src/features/generators/GeneratorTable.tsx

import React from 'react';
import { Table, Tag, Space, Tooltip } from 'antd';
import type { TableProps } from 'antd'; // 匯入 AntD 的型別
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { Site } from '../../types/site'; // 匯入我們定義的型別



// 1. 定義 props 型別
interface SiteTableProps {
    loading: boolean;
    data: Site[];
    onEdit: (record: Site) => void; // 新增 onEdit prop 並定義型別
    onView: (record: Site) => void; // 新增 onView prop 並定義型別
}

// 2. 使用 TableProps<Generator> 來精確定義 columns 的型別
const getColumns = (
    onEdit: (record: Site) => void,
    onView: (record: Site) => void
): TableProps<Site>['columns'] => [
        {
            title: '站點名稱',
            dataIndex: 'Name',
            key: 'name',
            width: 150,
        },
        {
            title: '站點地址',
            dataIndex: 'Address',
            key: 'address',
            fixed: 'left',
            width: 150,
        },
        {
            title: '聯絡方式',
            dataIndex: 'Contact_json',
            key: 'Contact_json',
            width: 120,
            render: (contact: string) => {
                var j = JSON.parse(contact);
                var keys = Object.getOwnPropertyNames(j);
                const data = keys.map((k) => ({
                    keye: k,
                    value: j[k],
                }));
                const columns = [
                    {
                        title: null,
                        dataIndex: 'keye',
                        key: 'keye',
                    },
                    {
                        title: null,
                        dataIndex: 'value',
                        key: 'value',
                    },
                ];

                return <Table
                    columns={columns}
                    dataSource={data}
                    showHeader={false}
                    pagination={false}
                />;
            },
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, record: Site) => ( // 4. 幫 record 加上型別
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
const SiteTable: React.FC<SiteTableProps> = ({ loading, data, onEdit, onView }) => {

    // 將 columns 的定義移入元件內部，這樣它才能存取 props (onEdit, onView)
    const columns = getColumns(onEdit, onView);

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            scroll={{ x: 800 }}
            bordered
            // pagination={{ pageSize: 10 }}

        />
    );
};

export default SiteTable;