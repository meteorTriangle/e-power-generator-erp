// src/features/sites/SiteTable.tsx

import React from 'react';
import { Table, List, Card, Tag, Descriptions, Button, Space, Tooltip } from 'antd';
import type { TableProps } from 'antd'; // 匯入 AntD 的型別
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { Site, ContactInfo } from '../../types/site'; // 匯入我們定義的型別
import { DeviceSelect, useDeviceType } from '../../router/mobilePCRoute';



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
			minWidth: 50,
			fixed: 'left',
			width: "150px",

		},
		{
			title: '站點地址',
			dataIndex: 'Address',
			key: 'address',
			minWidth: 130,
		},
		{
			title: '聯絡方式',
			dataIndex: 'Contact',
			key: 'Contact',
			minWidth: 420,
			render: (contact: ContactInfo[]) => {
				const columns = [
					{
						title: null,
						dataIndex: 'Way',
						key: 'Way',
						minWidth: 140,
						width: "34%"
					},
					{
						title: null,
						dataIndex: 'Value',
						key: 'Value',
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
							dataSource={contact}
							showHeader={false}
							pagination={false}
							style={{ minWidth: "100%" }}
						/>
					</div>);
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
	const currentDevice = useDeviceType();

	return (
		<>

			<DeviceSelect deviceType={['desktop']}>

				<Table
					columns={columns}
					dataSource={data}
					loading={loading}
					rowKey="ID"
					scroll={{ x: 1000 }}
					bordered
				// pagination={{ pageSize: 10 }}

				/>
			</DeviceSelect>
			<DeviceSelect deviceType={['laptop', 'mobile', 'tablet']}>
				<List
					grid={{ gutter: 16, column: 1 }}
					dataSource={data}
					loading={loading}
					renderItem={(item) => (
						<Card
							title={item.Name}
							extra={
								<Space>
									<Tooltip title="編輯">
										<Button
											type="text"
											icon={<EditOutlined />}
											onClick={() => onEdit(item)}
										/>
									</Tooltip>
									<Tooltip title="查看詳情">
										<Button
											type="text"
											icon={<EyeOutlined />}
											onClick={() => onView(item)}
										/>
									</Tooltip>
								</Space>
							}
						>
							<Descriptions column={1} bordered size="small" layout={['mobile'].includes(currentDevice) ? 'vertical' : 'horizontal'}>
								<Descriptions.Item label="站點地址">{item.Address}</Descriptions.Item>
								<Descriptions.Item label="聯絡方式">
									<List
										dataSource={item.Contact}
										renderItem={(contact) => (
											<List.Item>
												<Tag color="blue" style={{ marginRight: 8 }}>{contact.Way}</Tag>
												<span>{contact.Value}</span>
											</List.Item>
										)}
									/>
								</Descriptions.Item>
							</Descriptions>
						</Card>)}
				>
				</List>
			</DeviceSelect>
		</>
	);
};

export default SiteTable;