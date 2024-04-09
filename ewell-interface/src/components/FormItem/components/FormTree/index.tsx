import { Tree, TreeProps } from 'antd';

export type FormTreeProps = {
  value?: string[];
  onChange?: TreeProps['onCheck'];
} & TreeProps;
export default function FormTree({ value, onChange, ...props }: FormTreeProps) {
  return <Tree {...props} checkedKeys={value} onCheck={onChange} />;
}
