import React, { useState } from 'react';
import { Modal, Button, Card, Form, Input, Typography, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Site } from '../types/site';
import apiClient from '../services/apiClient';
// import type { AxiosError } from 'axios';

interface AddSiteModalProps {
    onRefresh: () => void; // 新增一個 onRefresh prop
}

const AddSiteModal: React.FC<AddSiteModalProps> = ({ onRefresh }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSucModalVisible, setIsSucModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleAddSite = async (values: Site) => {
        try {
            setLoading(true);
            // 假設 axios 回傳的 data 型別是 Generator[]
            await apiClient.post('/site/add', values);
            setError(null);
            handleCancel();
            setIsSucModalVisible(true);
        } catch (err: unknown) {
            setError("新增站點失敗：" + (err.message || '未知錯誤'));
        } finally {
            setLoading(false);
        }
    };
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleSucOk = () => {
        setIsSucModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleSucCancel = () => {
        setIsSucModalVisible(false);
        onRefresh();
    };


    const errorCard = () => {
        if (error) {
            return <Alert message="錯誤" description={error} type="error" showIcon />;
        }
        return null;
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
            >
                新增站點
            </Button>
            <Modal
                // title="新增站點"
                // visible={isModalVisible}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null} // 取消預設的 Footer
                style={{ padding: '0px' }}
            >

                <Card title="新增站點" style={{ border: 'none' }}>
                    <Form
                        layout="vertical"
                        onFinish={handleAddSite}
                        autoComplete="off"
                    >
                        <Form.Item
                            hidden={true}
                            name="ID"
                            initialValue={0}
                        >

                        </Form.Item>
                        <Form.Item
                            label="站點名稱"
                            name="Name"
                            rules={[{ required: true, message: '請輸入站點名稱' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="地址"
                            name="Address"
                            rules={[{ required: true, message: '請輸入地址' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Card>
                            <Typography.Title level={5}>主要聯絡人資訊</Typography.Title>
                            <Form.List name="Contact">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'Way']}
                                                    rules={[{ required: true, message: '請輸入聯絡方式' }]}
                                                    style={{ flex: 1, marginRight: 8 }}
                                                >
                                                    <Input placeholder="聯絡方式" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'Value']}
                                                    rules={[{ required: true, message: '請輸入聯絡電話' }]}
                                                    style={{ flex: 1, marginRight: 8 }}
                                                >
                                                    <Input placeholder="聯絡電話" />
                                                </Form.Item>
                                                {fields.length > 1 ? (
                                                    <Button
                                                        type="link"
                                                        onClick={() => remove(name)}
                                                        danger
                                                    >
                                                        刪除
                                                    </Button>
                                                ) : null}
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                新增聯絡人
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                新增站點
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                {errorCard()}
            </Modal>
            <Modal
                title="新增成功"
                open={isSucModalVisible}
                onOk={handleSucOk}
                onCancel={handleSucCancel}
                footer={null} // okButton only
            >
                <Alert message="新增成功" type="success" showIcon />
            </Modal>
        </>
    );
};

export default AddSiteModal;