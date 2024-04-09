import { Steps, StepsProps, StepProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import './styles.less';

const ESteps: React.FC<StepsProps> = ({ items, ...props }) => {
  const [stepsData, setStepsData] = useState<StepProps[]>(items || []);
  const isWide = useMedia('(max-width: 640px)');

  useEffect(() => {
    isWide ? setStepsData(Array(4).fill({})) : setStepsData(items || []);
  }, [isWide, items]);

  return <Steps className="esteps" items={stepsData} responsive={false} {...props} />;
};

export default ESteps;
