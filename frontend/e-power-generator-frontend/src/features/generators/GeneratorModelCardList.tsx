// src/features/generators/GeneratorModelCardList.tsx
import React from 'react';
// card list
import { Row, Col } from 'antd';
import type {
    GeneratorModel,
} from "../../types/generatorModel"
import GeneratorModelCard from '../../components/GeneratorModelCard';

interface GeneratorModelCardListProps {
    data: GeneratorModel[];
    onEdit: (record: GeneratorModel) => void;
    onView: (record: GeneratorModel) => void;
}

const GeneratorModelCardList: React.FC<GeneratorModelCardListProps> = ({ data, onEdit, onView }) => {
    return (
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
            {data.map((model) => {
                const fuelSpec = model.spec.find(spec => spec.SpecName === '燃料類型');
                const fuelType = fuelSpec ? fuelSpec.SpecValue : '未知';
                const imageUrl = (model.MachineImgPath[0] === '/' ? "" : "/" )+ model.MachineImgPath;
                return (
                    <Col key={model.ID} style={{ display: 'flex' }} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <GeneratorModelCard
                            modelName={model.Name}
                            powerOutput={model.Power}
                            fuelType={fuelType}
                            imageUrl={imageUrl}
                            onEdit={() => onEdit(model)}
                            onView={() => onView(model)}
                        />
                    </Col>
                );
            })}
        </Row>
    );
};

export default GeneratorModelCardList;