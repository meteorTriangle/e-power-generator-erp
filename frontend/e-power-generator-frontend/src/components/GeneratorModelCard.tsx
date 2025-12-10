// src/components/GeneratorModelCard.tsx
import React from 'react';
import { Card, Image } from 'antd';

// get current device screen width px
// const screenWidth = window.innerWidth;


interface GeneratorModelCardProps {
	modelName: string;
	powerOutput: number; // in W
	fuelType: string;
	imageUrl: string;
	onEdit?: () => void;
	onView?: () => void;
}

const GeneratorModelCard: React.FC<GeneratorModelCardProps> = ({ modelName, powerOutput, fuelType, imageUrl, onEdit, onView }) => {
  return (
    <Card
      hoverable
      style={{ width: '100vw', height: 500 }}
      cover={<Image alt={modelName} src={imageUrl} width={'100%'} height={300} style={{ objectFit: 'contain' }} />}
      actions={[
        onEdit && <a onClick={onEdit}>編輯</a>,
        onView && <a onClick={onView}>查看</a>,
      ].filter(Boolean)}
    >
      <Card.Meta
        title={modelName}
        description={
          <>
            <p>功率輸出: {powerOutput} W</p>
            <p>燃料類型: {fuelType}</p>
          </>
        }
      />
    </Card>
  );
};

export default GeneratorModelCard;

// Card 內顯示發電機資訊