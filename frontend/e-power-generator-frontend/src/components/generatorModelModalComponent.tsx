// src//components/generatorModelModalComponent.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Input, Alert, Upload, type UploadProps } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { GeneratorModel } from '../types/generatorModel';
import apiClient from '../services/apiClient';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

interface modelModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: GeneratorModel;
    type: string;
}


type UrlUploadBaseProps = {
    action?: string;
    children?: React.ReactNode;
};

type UrlUploadMultipleProps = UrlUploadBaseProps & {
    multiple: true;
    value?: string[]; // value 是 string[]
    onChange?: (value?: string[]) => void; // onChange 回傳 string[]
};

// 2. 單檔上傳的 Props (multiple: false 或 undefined)
type UrlUploadSingleProps = UrlUploadBaseProps & {
    multiple?: false;
    value?: string; // value 是 string
    onChange?: (value?: string) => void; // onChange 回傳 string
};

type UploadImgInputProps = UrlUploadSingleProps | UrlUploadMultipleProps;

type UploadFileType = UploadFile<string>;



const UploadImgInput: React.FC<UploadImgInputProps> = (props) => {
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
    const isMultiple = !!props.multiple;
    const [internalFileList, setInternalFileList] = useState<UploadFileType[]>([]);

    const propUrls = useMemo(() => {
        if (isMultiple) {
            // 模式 A: 多檔，props.value 應為 string[]
            const { value } = props as UrlUploadMultipleProps;
            return Array.isArray(value) ? value : [];
        } else {
            // 模式 B: 單檔，props.value 應為 string
            const { value } = props as UrlUploadSingleProps;
            return value ? [value] : [];
        }

    }, [isMultiple, (props as any).value]);

    // 6. (更新) Effect：同步 propUrls 到 internalFileList
    useEffect(() => {
        // 取得內部 state 的 URLs
        const stateUrls = internalFileList
            .filter(file => file.status === 'done')
            .map(file => file.url || (file.response && file.response))
            .filter(Boolean) as string[];

        // 比較是否失同步
        const isOutOfSync = propUrls.length !== stateUrls.length ||
            propUrls.some((url, index) => url !== stateUrls[index]);

        if (isOutOfSync) {
            const newFileList: UploadFileType[] = propUrls.map((url, index) => ({
                uid: `init-${index}-${url}`,
                name: url.substring(url.lastIndexOf('/') + 1) || `file-${index}`,
                status: 'done',
                url: url,
            }));
            setInternalFileList(newFileList);
        }
    }, [propUrls]); // 依賴於上面 useMemo 算出的 propUrls

    // 7. (更新) 處理 Upload 變更
    const handleUploadChange = (info: UploadChangeParam<UploadFileType>) => {
        let fileList = [...info.fileList];

        // 如果是單檔模式，只保留最後一個檔案
        if (!isMultiple) {
            fileList = fileList.slice(-1);
        }

        // 更新內部 UI 狀態
        setInternalFileList(fileList);

        const { status } = info.file;

        // 當上傳完成或移除時，觸發 Form 的 onChange
        if (status === 'done' || status === 'removed') {
            const processedUrls = fileList
                .filter(file => file.status === 'done')
                .map(file => file.response || file.url)
                .filter(Boolean) as string[];

            // 根據模式呼叫
            if (isMultiple) {
                // 模式 A: 多檔，回傳 string[]
                const { onChange } = props as UrlUploadMultipleProps;
                onChange?.(processedUrls);
            } else {
                // 模式 B: 單檔，回傳 string (processedUrls[0]) 或 undefined
                const { onChange } = props as UrlUploadSingleProps;
                onChange?.(processedUrls[0]);
            }
        }
    };



    const imageProps: UploadProps = {
        onPreview: async (file) => {
            let src = ((file.response || file.url)[0] == '/' ? '' : '/') + (file.response || file.url) as string;
            console.log('file', src);
            setPreviewImageSrc(src);
            setIsPreviewVisible(true);
        },
        action: props.action || '/api/v1/upload/tmp',
        onChange: (info) => { handleUploadChange(info)},
        fileList: internalFileList,
        multiple: isMultiple,
        listType: 'picture-card',
        accept: "image/*",
        maxCount: isMultiple ? undefined : 1,
    }

    return (
        <>
            <Upload
                {...imageProps}
            >{props.children}</Upload>
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

    const handleSubmit = async (values: GeneratorModel) => {
        try {
            setLoading(true);
            console.log('values', values);
            values.Power = Number(values.Power);
            if (type === 'add') {
                await apiClient.post('/generatorModel/upload', values);
            } else {
                await apiClient.post(`/generatorModel/update`, values);
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

    return (
        <Modal
            open={visible}
            title={`${typeName}發電機型號`}
            onCancel={onClose}
            footer={null}
            destroyOnHidden={true}
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
                <Form.Item name="SpecImgPath" label="規格圖片" rules={[{ required: true, }]} >
                    <UploadImgInput multiple={false} >
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </UploadImgInput>
                </Form.Item>
                <Form.Item name="MachineImgPath" label="封面圖片" rules={[{ required: true }]}>
                    <UploadImgInput multiple={false} >
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </UploadImgInput>
                </Form.Item>
                <Form.Item name="OtherImgPath" label="其他圖片" >
                    <UploadImgInput multiple={true} >
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