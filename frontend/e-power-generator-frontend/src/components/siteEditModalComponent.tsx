// src//components/siteEditModalComponent.tsx

import React, { Children, useState } from 'react';
import { Modal, Button, Card, Form, Input, Typography, Alert, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Site } from '../types/site';
import apiClient from '../services/apiClient';


// const [ edit, setEdit ] = useState(false);

interface editSiteModalProps {
    onRefresh: () => void; // 新增一個 onRefresh prop
    record: Site; // 新增一個 record prop
    edit: boolean; // 新增一個 edit prop
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    type: string;
}


const EditSiteModal: React.FC<editSiteModalProps> = ({ onRefresh, record, edit, setEdit, type }) => {
    const typeName = type === 'add' ? '新增' : '編輯';

    const [isSucModalVisible, setIsSucModalVisible] = useState(false);
    const [isDelModalVisible, setIsDelModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSite = async (values: Site) => {
        try {
            setLoading(true);
            // 假設 axios 回傳的 data 型別是 Generator[]
            await apiClient.post('/site/edit', values);
            setError(null);
            handleCancel();
            setIsSucModalVisible(true);
        } catch (err: any) {
            setError(typeName + "站點失敗：" + (err.message || '未知錯誤'));
        } finally {
            setLoading(false);
        }
    };



    const handleOk = () => {
        setEdit(false);
    };
    const handleSucOk = () => {
        setIsSucModalVisible(false);
    };
    const handleDelOk = () => {
        setIsDelModalVisible(false);
    };
    const handleCancel = () => {
        setEdit(false);
    };
    const handleSucCancel = () => {
        setIsSucModalVisible(false);
        onRefresh();
    };
    const handleDelCancel = () => {
        setIsDelModalVisible(false);
        onRefresh();
    };
    const handleDelete = async (values: Site, setComfirm: React.Dispatch<React.SetStateAction<boolean>>) => {
        try {
            setDelLoading(true);
            // 假設 axios 回傳的 data 型別是 Generator[]
            await apiClient.post('/site/delete', values);
            setError(null);
            handleCancel();
            // setIsDelModalVisible(true);
            setComfirm(true);
        } catch (err: any) {
            setError("刪除站點失敗：" + (err.message || '未知錯誤'));
        } finally {
            setDelLoading(false);
        }
    };

    const deleteButton = () => {
        if (type === 'edit') {
            return (
                <Form.Item>
                    <Button type="primary" danger onClick={() => {setIsDelModalVisible(true); setEdit(false)}} loading={delLoading} block>
                        刪除站點
                    </Button>
                </Form.Item>
            );
        }
        return null;
    };

    const delSucModal = () => {
        return (
            <Modal
                title="刪除成功"
                open={isDelModalVisible}
                onOk={handleDelOk}
                onCancel={handleDelCancel}
                footer={null} // okButton only
            >
                <Alert message="刪除成功" type="success" showIcon />
            </Modal>
        )
    };

    const comfirmDeleteModal = () => {
        const [comfirm, setComfirm] = useState(false);
        if (comfirm) {
            return delSucModal();
        }
        return (
            <Modal
                title="確認刪除"
                open={isDelModalVisible}
                // onOk={() => handleDelete(record)}
                onCancel={handleDelCancel}
                footer={null} // okButton only
                destroyOnHidden={true}
            >
                <Form
                    layout="vertical"
                    onFinish={(values) => {
                        if(values.SiteName === record.Name){
                            handleDelete(record, setComfirm)
                            setComfirm(true);
                        }else{
                            setError("站點名稱輸入錯誤，請重新輸入");
                            setComfirm(false);
                        }}}
                    autoComplete="off"
                >
                    <Alert message={"確定要刪除【" + record.Name + "】站點嗎？"} type="warning" showIcon />
                    <Form.Item
                        label="請輸入站點名稱"
                        name="SiteName"
                        layout='vertical'
                        rules={[{ required: true, message: '請輸入站點名稱' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" danger loading={delLoading} block>
                            刪除站點
                        </Button>
                    </Form.Item>
                    <Form.Item> 
                        {errorCard()}
                    </Form.Item>
                </Form>
            </Modal>
        )
        // }

    };


    const errorCard = () => {
        if (error) {
            return <Alert message="錯誤" description={error} type="error" showIcon />;
        }
        return null;
    };

    return (
        <>
            <Modal
                open={edit}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null} // 取消預設的 Footer
                style={{ padding: '0px' }}
                destroyOnHidden={true}
            >

                <Card title={typeName + "站點"} style={{ border: 'none' }}>
                    <Form
                        layout="vertical"
                        onFinish={handleSite}

                        autoComplete="off"
                        initialValues={record}

                    >
                        <Form.Item
                            hidden={true}
                            name="ID"
                        // initialValue={0}
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
                                {typeName + "站點"}
                            </Button>
                        </Form.Item>
                        {deleteButton()}
                    </Form>
                </Card>
                {errorCard()}
            </Modal>
            <Modal
                title={typeName + "成功"}
                open={isSucModalVisible}
                onOk={handleSucOk}
                onCancel={handleSucCancel}
                footer={null} // okButton only
            >
                <Alert message={typeName + "成功"} type="success" showIcon />
            </Modal>
            {comfirmDeleteModal()}
        </>
    );
};

export default EditSiteModal;