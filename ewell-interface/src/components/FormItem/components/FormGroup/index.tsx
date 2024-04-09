import { Radio, RadioProps } from 'antd';
import { useEffect, useState } from 'react';
export default function FormGroup({
  radioList,
  value,
  onChange,
  disabled,
}: {
  disabled?: boolean;
  radioList: RadioProps[];
  value?: any;
  onChange?: (value: any) => void;
}) {
  const [width, setWidth] = useState('');

  useEffect(() => {
    const length = radioList.length || 1;
    const width = Math.floor(100 / length) + '%';
    console.log('use effect width', width, length);
    setWidth(width);
  }, [radioList]);

  return (
    <Radio.Group
      disabled={disabled}
      value={value}
      onChange={(v) => onChange?.(v.target.value)}
      style={{ width: '100%' }}>
      {radioList.map((i, k) => (
        <Radio key={k} {...i} style={{ width, marginRight: 0 }} />
      ))}
    </Radio.Group>
  );
}
