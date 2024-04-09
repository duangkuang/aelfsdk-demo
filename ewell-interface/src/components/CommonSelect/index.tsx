import { Col, Select, SelectProps } from 'antd';
import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import './styles.less';
export type CommonSelectItem = { title: string; key?: string; value?: string };
type ColProps = {
  span?: number;
  flex?: number;
};
export type CommonSelectLayout = {
  span?: number;
  leftCol?: ColProps;
  rightCol?: ColProps;
};
export function CommonSelect(
  props: SelectProps<any> & {
    title: string;
    list?: CommonSelectItem[];
    rightElement?: ReactNode;
    layout?: CommonSelectLayout;
  },
) {
  const { title, list, rightElement, className, layout, ...selectProps } = props;
  const { span = 8, leftCol, rightCol } = layout || {};
  const leftProps = useMemo(() => {
    const leftSpan = leftCol?.span || 8;
    return {
      span: leftSpan,
      xl: leftSpan,
      // MAX 24
      lg: Math.min(Math.floor(leftSpan * 1.2), 24),
      xxl: Math.min(Math.floor(leftSpan * 0.8), 24),
    };
  }, [leftCol?.span]);
  return (
    <Col className={clsx('common-select', className)} span={span}>
      <Col sm={23} {...leftProps}>
        {title}
      </Col>
      <Col sm={23} span={rightCol?.span} md={rightCol?.span} flex={!rightCol ? 1 : rightCol?.flex}>
        {rightElement ? (
          rightElement
        ) : (
          <Select {...selectProps}>
            {list?.map(({ title }) => {
              return (
                <Select.Option key={title} value={title}>
                  {title}
                </Select.Option>
              );
            })}
          </Select>
        )}
      </Col>
    </Col>
  );
}
