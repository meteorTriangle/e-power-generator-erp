// src/features/generators/GeneratorModalTable.tsx

import React from 'react';
import type {
    GeneratorModel,
    GeneratorModelSpec
} from "../../types/generatorModel"
import { Table, Space, Tooltip } from 'antd';
import type { TableProps } from 'antd'; // 匯入 AntD 的型別
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

// 1. 定義 props 型別
interface GeneratorModelTableProps {
    loading: boolean;
    data: GeneratorModel[];
    onEdit: (record: GeneratorModel) => void; // 新增 onEdit prop 並定義型別
    onView: (record: GeneratorModel) => void; // 新增 onView prop 並定義型別
}

// 2. 使用 TableProps<Generator> 來精確定義 columns 的型別
const getColumns = (
    onEdit: (record: GeneratorModel) => void,
    onView: (record: GeneratorModel) => void
): TableProps<GeneratorModel>['columns'] => [
        {
            title: '機型照片',
            dataIndex: 'MachineImgPath',
            key: 'MachineImgPath',
            fixed: 'left',
            width: 200,
            render: (imageURL: string) => {
                imageURL = (imageURL[0] === '/' ? "" : "/" )+ imageURL;
                return <img src={imageURL} alt="Generator Model" style={{ maxWidth: '170px', maxHeight: '170px' }} />;
            }
        },
        {
            title: '型號名稱',
            dataIndex: 'Name',
            key: 'Name',
            fixed: 'left',
            width: 150,
        },
        {
            title: '功率(W)',
            dataIndex: 'Power',
            key: 'Power',
            width: 150,
        },
        {
            title: '規格',
            dataIndex: 'spec',
            key: 'spec',
            render: (specs: GeneratorModelSpec[]) => {
                const columns = [
                    {
                        title: null,
                        dataIndex: 'SpecName',
                        key: 'SpecName',
                        minWidth: 140,
                        width: "34%"
                    },
                    {
                        title: null,
                        dataIndex: 'SpecValue',
                        key: 'SpecValue',
                        minWidth: 200,
                        width: "66%"
                    },
                ];
                return (
                    <div
                        // size="middle"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: "auto",
                        }}
                    >

                        <Table
                            columns={columns}
                            dataSource={specs}
                            showHeader={false}
                            pagination={false}
                            scroll={{y: 168}}
                            style={{ minWidth: "100%" }}
                        />
                    </div>
                );
            },
        },
        {
            title: '操作 (Actions)',
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, record: GeneratorModel) => ( // 4. 幫 record 加上型別
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
const GeneratorModelTable: React.FC<GeneratorModelTableProps> = ({ loading, data, onEdit, onView }) => {

    // 將 columns 的定義移入元件內部，這樣它才能存取 props (onEdit, onView)
    const columns = getColumns(onEdit, onView);

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="ID"
            scroll={{ x: 800 }}
        />
    );
};

export default GeneratorModelTable;