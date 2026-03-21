// src/pages/user/inquiry.tsx
import React, { useState, useEffect } from 'react';
import type { GeneratorModel } from '../../types/generatorModel';
import { Card, Form, Input, Button, Typography, Image, Radio, Modal, DatePicker, TimePicker } from 'antd';
import styles from '../Login.module.css';

const { Title } = Typography;

const GeneratorModelSelectModal: React.FC<{
    visible: boolean;
    onSelect: (model: GeneratorModel) => void;
    onCancel: () => void;
}> = ({ visible, onSelect, onCancel }) => {
    // Fetch generator models for selection
    const [generatorModels, setGeneratorModels] = useState<GeneratorModel[]>([]);

    // You can add useEffect here to fetch models from API if needed
    // "/api/v1/public/model/listall"
    useEffect(() => {
        const fetchGeneratorModels = async () => {
            try {
                const response = await fetch('/api/v1/public/model/listall');
                const data = await response.json();
                // Adjust image paths if necessary
                data.forEach((model: GeneratorModel) => {
                    model.MachineImgPath = (model.MachineImgPath[0] === '/' ? "" : "/" )+ model.MachineImgPath;
                });
                setGeneratorModels(data);
            } catch (error) {
                console.error('Failed to fetch generator models:', error);
            }
        };

        if (visible) {
            fetchGeneratorModels();
        }
    }, [visible]);


    return (
        <Modal
            title="選擇發電機型號"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width="80%"
        >
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {generatorModels.map((model) => (
                    <Card
                        key={model.ID}
                        hoverable
                        style={{ marginBottom: 16 }}
                        onClick={() => {
                            onSelect(model);
                            onCancel();
                        }}
                    >
                        <Card.Meta
                            avatar={<Image width={80} src={model.MachineImgPath} />}
                            title={model.Name}
                            description={`功率輸出: ${model.Power}W`}
                        />
                    </Card>
                ))}
            </div>
        </Modal>
    );
};

const InquiryPage: React.FC = () => {
    // Form Data
    // - User Information (auto fill up if logged in)
    //     - Name
    //     - Email
    //     - Phone Number
    // - Inquiry Details
    //    - check if user knowns the model which they are inquiring about (yes/no) check box
    //    - if yes:
    //       - Generator Model (dropdown from available models)
    //    - if no:
    //       - Textarea for user to describe their needs
    //       - device type selection (e.g., home use, market use, contractor use, etc. )
    //       - power output range selection (e.g., <1000W, 1000W-3000W, >3000W)
    //       - noise level preference (e.g., low noise, moderate, no preference)
    //       - device which user plans to power with the generator (e.g., refrigerator, lights, power tools, etc.)
    // - Submit Button

    const [knowsModel, setKnowsModel] = useState<"true" | "false">("true"); // This should be managed by state based on user input
    
    const [selectedModel, setSelectedModel] = useState<GeneratorModel | null>(null);

    const handleSelectModel = (model: GeneratorModel) => {
        setSelectedModel(model);
    };

    const [isModelSelectionModalVisible, setIsModelSelectionModalVisible] = useState(false);

    return (
        <div>
            {/* Form components will go here */}
            <GeneratorModelSelectModal
                visible={isModelSelectionModalVisible}
                onSelect={handleSelectModel}
                onCancel={() => setIsModelSelectionModalVisible(false)}
            />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', width: '100vw' }}>
            <Card style={{ maxWidth: 600, minWidth: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Title level={2}>詢價</Title>
                <Form
                    name="inquiry_form"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    layout="vertical"
                >

                    <Title level={4}>基本資料</Title>
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '請輸入您的姓名!' }]}
                    >
                        <Input placeholder="您的姓名" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="電子郵件"
                        name="email"
                        rules={[{ required: true, message: '請輸入您的電子郵件!' }]}
                    >
                        <Input placeholder="您的電子郵件" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="電話號碼"
                        name="phone"
                        rules={[{ required: true, message: '請輸入您的電話號碼!' }]}
                    >
                        <Input placeholder="您的電話號碼" size="large" />
                    </Form.Item>

                    <Title level={4}>租借資料</Title>
                    <Title level={5}>租借時間範圍</Title>
                    <Form.Item
                        name="startDateTime"
                        rules={[{ required: true, message: '請選擇開始日期!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            size="large"
                            format="YYYY-MM-DD"
                            placeholder="開始日期"
                        />
                        <TimePicker
                            style={{ width: '100%' }} 
                            size="large"
                            format="HH:mm"
                            placeholder="開始時間"
                        />
                    </Form.Item>
                    <Form.Item
                        name="endDateTime"
                        rules={[{ required: true, message: '請選擇結束日期!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            size="large"
                            format="YYYY-MM-DD"
                            placeholder="結束日期"
                        />
                        <TimePicker
                            style={{ width: '100%' }} 
                            size="large"
                            format="HH:mm"
                            placeholder="結束時間"
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="您是否知道您要詢價的發電機型號？"
                        name="knowsModel"
                        rules={[{ required: true, message: '請選擇是或否!' }]}
                    >
                        <Radio.Group block buttonStyle="solid" value={knowsModel} onChange={e => setKnowsModel(e.target.value as "true" | "false")} >
                            <Radio.Button value="true">是</Radio.Button>
                            <Radio.Button value="false">否</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {/* Additional form items based on user input can be added here */}
                    { knowsModel == 'true' ? (
                        <Form.Item
                            label="發電機型號"
                            name="generatorModel"
                            rules={[{ required: true, message: '請選擇發電機型號!' }]}
                        >
                            {/* a modal to select generator model */}
                            <Input placeholder="請輸入或選擇發電機型號" size="large" type="button" hidden>
                            </Input>
                            <Button type="default" size="large" onClick={() => { setIsModelSelectionModalVisible(true); }}>
                                {selectedModel ? `型號: ${selectedModel.Name}` : '選擇發電機型號'}
                            </Button>
                            
                        </Form.Item>
                    ) : (
                        <>
                        <Form.Item
                            label="請描述您的需求"
                            name="needsDescription"
                            rules={[{ required: true, message: '請描述您的需求!' }]}
                        >
                            <Input.TextArea rows={4} placeholder="描述您的需求" />
                        </Form.Item>

                        <Form.Item
                            label="設備類型"
                            name="deviceType"
                            rules={[{ required: true, message: '請選擇設備類型!' }]}
                        >
                            <Input placeholder="例如：家庭用、市場用、承包商用等" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="功率範圍"
                            name="powerRange"
                            rules={[{ required: true, message: '請選擇功率範圍!' }]}
                        >
                            <Input placeholder="例如：<1000W, 1000W-3000W, >    3000W" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="噪音偏好"
                            name="noisePreference"
                            rules={[{ required: true, message: '請選擇噪音偏好!' }]}
                        >
                            <Input placeholder="例如：低噪音、適中、無偏好" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="您計劃用發電機供電的設備"
                            name="poweredDevices"
                            rules={[{ required: true, message: '請輸入設備名稱!' }]}
                        >
                            <Input placeholder="例如：冰箱、燈具、電動工具等" size="large" />
                        </Form.Item>
                        </>

                    )

                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                            提交詢價
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            </div>
        </div>
    );
}
export default InquiryPage;