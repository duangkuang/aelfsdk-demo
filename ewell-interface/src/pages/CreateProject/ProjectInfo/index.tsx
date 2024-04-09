import React, { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import { FormFields } from 'components/FormItem';
import { Form, message } from 'antd';
import CustomMark from '../components/CustomMark';
import { CreateStepProps } from '../types';
import ButtonGroup from '../components/ButtonGroup';
import storages from '../storages';
import { getProjectInfoFromJson } from '../constants';
import { useMobile } from 'contexts/useStore/hooks';

const ProjectInfo: React.FC<CreateStepProps> = ({ onNext, onPre }) => {
  const [additional, setAdditional] = useLocalStorage(storages.AdditionalInformation, {});
  const isMobile = useMobile();

  const projectInfoFromJson = useMemo(() => getProjectInfoFromJson(isMobile), [isMobile]);

  const onFinish = useCallback(
    (value: any) => {
      console.log('projectInfo', value);
      const { projectImgs, logoUrl } = value;

      if (!logoUrl || logoUrl.length <= 0) {
        message.warning('Please upload logo image.');
        return;
      }

      if (!projectImgs || projectImgs.length < 3) {
        message.warning('Please upload 3 to 5 project images.');
        return;
      }

      setAdditional(value);
      onNext?.();
    },
    [setAdditional, onNext],
  );

  return (
    <div className="project-info" style={{ margin: '48px 0 24px' }}>
      <Form
        layout="vertical"
        name="projectInfo"
        scrollToFirstError
        initialValues={additional}
        requiredMark={CustomMark}
        validateTrigger="onBlur"
        onFinish={onFinish}>
        {FormFields(projectInfoFromJson)}
        <Form.Item>
          <ButtonGroup onPre={onPre} htmlType="submit" />
        </Form.Item>
      </Form>
    </div>
  );
};
export default ProjectInfo;
