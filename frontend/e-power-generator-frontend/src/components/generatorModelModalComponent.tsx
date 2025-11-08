// src//components/generatorModelModalComponent.tsx

import React, { useState } from 'react';
import { Modal, Button, Form, Input, Alert, Upload, type UploadProps } from 'antd';
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

interface UploadImgInputProps {
    value?: string[] | string | undefined;
    children?: React.ReactNode;
    maxCount?: number;
    action?: string;
    onChange?: (value: string[] | string) => void;
    isSingle: boolean;
}
const UploadImgInput: React.FC<UploadImgInputProps> = ({ value, children, maxCount, action, onChange, isSingle }) => {
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
    var result: string[]|string|undefined = isSingle ? '' : [];
    const defaultFileList: UploadProps['defaultFileList'] = (
        value ? (Array.isArray(value) ? value.map((path, index) => ({
            uid: `${(index + 1) * -1}`,
            name: `OtherImg_${index}.png`,
            status: 'done',
            url: path,
            thumbUrl: path,
            response: path,
        })) : ([{
            uid: `-1`,
            name: `OtherImg_1.png`,
            status: 'done',
            url: value,
            thumbUrl: value,
            response: value,
        }])) : []);
    const imageProps: UploadProps = {
        onPreview: async (file) => {
            let src = (file.response[0] == '/' ? '' : '/') + file.response as string;
            console.log('file', file);
            setPreviewImageSrc(src);
            setIsPreviewVisible(true);
        },
        action: action || '/api/v1/upload/tmp',
        defaultFileList: defaultFileList,
        onChange: (info) => {
            if (isSingle) {
                result = info.file.response;
                onChange?.(result ? result : '');
                return;
            } else {
                result = Array.isArray(result) ? result : [];
                info.fileList.forEach((file) => {
                    result = Array.isArray(result) ? result : [];
                    if (file.status === 'done') {
                        result?.push(file.response);
                    } else if (file.status === 'removed') {
                        const index = result?.indexOf(file.response);
                        if (index? (index > -1) : false) {
                            result?.splice(index ? index : 0, 1);
                        }
                    }
                });
                onChange?.(result || []);
            }
        },
        listType: 'picture-card',
        accept: "image/*",
        maxCount: maxCount,
    }

    return (
        <>
            <Upload
                {...imageProps}
            >{children}</Upload>
            <Modal title="圖片預覽" open={isPreviewVisible} footer={null} onCancel={() => setIsPreviewVisible(false)}>
                <img src={previewImageSrc} width="100%" />
            </Modal>
        </>
    );
};



const EditGeneratorModelModal: React.FC<modelModalProps> = ({ visible, onClose, onSuccess, initialData, type }) => {
    const typeName = type === 'add' ? '新增' : '編輯';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const [form] = Form.useForm();


    const handleUploaderValidate = (rule: any, value: any) => {
        if (rule.required) {
            if (!value || value.length === 0) {
                return Promise.reject('請上傳圖片');
            }
        }
        return Promise.resolve();
    }

    const handleSubmit = async (values: GeneratorModel) => {
        try {
            setLoading(true);
            // const values = await form.validateFields();
            // var OtherImgPath: string[] = [];
            // try {
            //     values.OtherImg.fileList.forEach((file: any) => {
            //         OtherImgPath.push(file.response);
            //     });
            // } catch (err) {
            //     OtherImgPath = [];
            // }
            console.log('values', values);
            // var model: GeneratorModel = {
            //     ID: 0,
            //     Name: values.Name,
            //     Power: Number(values.Power),
            //     spec: values.spec as GeneratorModelSpec[],
            //     SpecImgPath: values?.SpecImg?.fileList[0]?.response ? values.SpecImg.fileList[0].response : '',
            //     MachineImgPath: values?.ProductImg?.fileList[0]?.response ? values.ProductImg.fileList[0].response : '',
            //     OtherImgPath: OtherImgPath,
            // }
            if (type === 'add') {
                await apiClient.post('/generatorModel/upload', values);
            } else {
                await apiClient.post(`/generatorModel/update/`, values);
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

    // const aoc = (open: boolean) => {
    //     setError(null);
    //     console.log('afterOpenChange', form.getFieldsValue());
    //     if (!open) {
    //         // if (type === 'add') {
    //         //     form.resetFields();
    //         // } else if (type === 'edit') {
    //         //     form.setFieldsValue(initialData);
    //         //     form.setFieldValue('SpecImg',{"fileList": defaultSpecImgFileList});
    //         //     form.setFieldValue('ProductImg',{"fileList": defaultProductImgFileList});
    //         //     form.setFieldValue('OtherImg',{"fileList": defaultOtherImgFileList});
    //         //     form.setFieldsValue({}); // Trigger re-render
    //         // }
    //     } else {
    //         form.resetFields();
    //     }


    // };

    return (
        <Modal
            open={visible}
            title={`${typeName}發電機型號`}
            onCancel={onClose}
            footer={null}
            destroyOnHidden={true}
            // afterOpenChange={aoc}
        >
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialData}
                // clearOnDestroy={true}
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
                <Form.Item name="SpecImgPath" label="規格圖片" rules={[{ required: true, validator: handleUploaderValidate }]} >
                    <UploadImgInput maxCount={1} isSingle={true}>
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </UploadImgInput>
                </Form.Item>
                <Form.Item name="MachineImgPath" label="封面圖片" rules={[{ required: true, validator: handleUploaderValidate }]}>
                    <UploadImgInput maxCount={1} isSingle={true}>
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </UploadImgInput>
                </Form.Item>
                <Form.Item name="OtherImgPath" label="其他圖片" rules={[{ validator: handleUploaderValidate }]}  >
                    <UploadImgInput maxCount={undefined} isSingle={false}>
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </UploadImgInput>
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
        </Modal>
    );


};





export default EditGeneratorModelModal;