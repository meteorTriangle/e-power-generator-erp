// src//components/generatorModelModalComponent.tsx

import React, { useState } from 'react';
import { Modal, Button, Form, Input, Alert, Upload,  type UploadProps } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { GeneratorModel, GeneratorModelSpec } from '../types/generatorModel';
import apiClient from '../services/apiClient';

interface modelModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: GeneratorModel;
    type: string;
}

const EditGeneratorModelModal: React.FC<modelModalProps> = ({ visible, onClose, onSuccess, initialData, type }) => {
    const typeName = type === 'add' ? '新增' : '編輯';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const imageProps: UploadProps = {
        onPreview: async (file) => {
            let src = (file.response[0]=='/'? '': '/') + file.response as string;
            console.log('file', file);
            setPreviewImageSrc(src);
            setIsPreviewVisible(true);
        },
        action: '/api/v1/upload/tmp',
    };

    const defaultSpecImgFileList: UploadProps['defaultFileList'] = initialData?.SpecImgPath? [{
        uid: '-1',
        name: 'SpecImg.png',
        status: 'done',
        url: initialData.SpecImgPath,
        thumbUrl: initialData.SpecImgPath,
        response: initialData.SpecImgPath,
    }]: [];

    const defaultProductImgFileList: UploadProps['defaultFileList'] = initialData?.MachineImgPath? [{
        uid: '-1',
        name: 'ProductImg.png',
        status: 'done',
        url: initialData.MachineImgPath,
        thumbUrl: initialData.MachineImgPath,
        response: initialData.MachineImgPath,
    }]: [];

    const defaultOtherImgFileList: UploadProps['defaultFileList'] = initialData?.OtherImgPath? initialData.OtherImgPath.map((path, index) => ({
        uid: `${(index + 1) * -1}`,
        name: `OtherImg_${index}.png`,
        status: 'done',
        url: path,
        thumbUrl: path,
        response: path,
    })): [];


    const handleUploaderValidate = (rule: any, value: any) => {
        const require = (type === 'add')? rule.required : false;
        if (!value) {
            if (require) {
                // rule.message = '請上傳圖片';
                return Promise.reject(new Error('請上傳圖片'));
            }
            return Promise.resolve();
        }
        if (value.fileList?.length === 0) {
            if (require) {
                // rule.message = '請上傳圖片';
                return Promise.reject(new Error('請上傳圖片'));
            }
        }
        var hasUploading = false;
        value.fileList?.forEach((file: any) => {
            if (file.status !== 'done') {
                hasUploading = true;
                return;
            }
        });
        if (hasUploading) {
            return Promise.reject(new Error('圖片上傳中，請稍後'));
        }
        return Promise.resolve();
    };
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            var OtherImgPath: string[] = [];
            try {
                values.OtherImg.fileList.forEach((file: any) => {
                    OtherImgPath.push(file.response);
                });
            } catch (err) {
                OtherImgPath = [];
            }
            console.log('values', form.getFieldsValue());
            var model: GeneratorModel = {
                ID: 0,
                Name: values.Name,
                Power: Number(values.Power),
                spec: values.spec as GeneratorModelSpec[],
                SpecImgPath: values?.SpecImg?.fileList[0]?.response? values.SpecImg.fileList[0].response : '',
                MachineImgPath: values?.ProductImg?.fileList[0]?.response? values.ProductImg.fileList[0].response : '',
                OtherImgPath: OtherImgPath,
            }
            if (type === 'add') {
                await apiClient.post('/generatorModel/upload', model);
            } else {
                await apiClient.post(`/generatorModel/update/`, model);
            }
            setError(null);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError("操作失敗：" + (err || '未知錯誤'));
        } finally {
            setLoading(false);
        }
    };

    const aoc = (open: boolean)=>{
        setError(null); 
        console.log('afterOpenChange', form.getFieldsValue());
        if(!open){
            // if (type === 'add') {
            //     form.resetFields();
            // } else if (type === 'edit') {
            //     form.setFieldsValue(initialData);
            //     form.setFieldValue('SpecImg',{"fileList": defaultSpecImgFileList});
            //     form.setFieldValue('ProductImg',{"fileList": defaultProductImgFileList});
            //     form.setFieldValue('OtherImg',{"fileList": defaultOtherImgFileList});
            //     form.setFieldsValue({}); // Trigger re-render
            // }
        } else {
            form.resetFields();
        }


    };

    return (
        <Modal
            open={visible}
            title={`${typeName}發電機型號`}
            onCancel={onClose}
            footer={null}
            destroyOnHidden={true}
            afterOpenChange={aoc}
        >
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialData}
                clearOnDestroy={true}
                autoComplete="off"
            >
                <Form.Item name="ID" hidden>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Name"
                    label="型號名稱"
                    rules={[{ required: true, message: '請輸入型號名稱' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Power"
                    label="功率 (kW)"
                    rules={[{ required: true, message: '請輸入功率' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="SpecImg" label="規格圖片" rules={[{ required: true, validator: handleUploaderValidate }]}  >
                    <Input hidden defaultValue={"20"}/>
                    <Upload defaultFileList={defaultSpecImgFileList} {...imageProps} listType='picture-card' accept="image/*" maxCount={1} customRequest={()=>{return("21edd")}} >
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item name="ProductImg" label="封面圖片" rules={[{ required: true, validator: handleUploaderValidate }]}>
                    <Upload {...imageProps} defaultFileList={defaultProductImgFileList} listType='picture-card' accept="image/*" maxCount={1} >
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item name="OtherImg" label="其他圖片" rules={[{ validator: handleUploaderValidate }]}  >
                    <Upload {...imageProps} defaultFileList={defaultOtherImgFileList} listType='picture-card' accept="image/*" multiple={true} >
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.List name="spec">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'SpecName']}
                                        rules={[{ required: true, message: '請輸入規格名稱' }]}
                                        style={{ flex: 1, marginRight: 8 }}
                                    >
                                        <Input placeholder="規格名稱" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'SpecValue']}
                                        rules={[{ required: true, message: '請輸入規格參數' }]}
                                        style={{ flex: 1, marginRight: 8 }}
                                    >
                                        <Input placeholder="規格參數" />
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
                                    新增規格
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {typeName}
                    </Button>
                </Form.Item>
            </Form>
            <Modal title="圖片預覽" open={isPreviewVisible} footer={null} onCancel={() => setIsPreviewVisible(false)}>
                <img src={previewImageSrc} width="100%" />
            </Modal>
        </Modal>
    );


};





export default EditGeneratorModelModal;