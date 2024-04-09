import { Form, Select, FormItemProps as antFormItemProps, TimePicker, Flex, InputNumber } from 'antd';
import { Input } from 'aelf-design';
import { memo } from 'react';
import FormGroup from './components/FormGroup';
import FormTree from './components/FormTree';
import Upload from '../AWSUpload';
import FormDatePiker from './components/FormDatePicker';
import grayArrow from 'assets/images/project/grayArrow.svg';

import {
  datePickerProps,
  rowProps,
  fileUploadProps,
  groupProps,
  idCardUploadProps,
  inputProps,
  passwordProps,
  selectProps,
  textAreaProps,
  treeProps,
  searchSelectProps,
  timePickerProps,
  customizeProps,
  inputNumberProps,
  inlineFieldProps,
  FieldsGroupProps,
  pureTextProps,
} from './types';
export type FormItemProps = (
  | inputProps
  | textAreaProps
  | groupProps
  | treeProps
  | passwordProps
  | selectProps
  | datePickerProps
  | fileUploadProps
  | idCardUploadProps
  | rowProps
  | searchSelectProps
  | timePickerProps
  | customizeProps
  | inputNumberProps
  | inlineFieldProps
  | pureTextProps
  | FieldsGroupProps
) &
  antFormItemProps;

function getChildren(type: FormItemProps['type'], childrenProps: FormItemProps['childrenProps']) {
  switch (type) {
    case 'input':
      return <Input {...(childrenProps as inputProps['childrenProps'])} />;
    case 'group':
      return <FormGroup {...(childrenProps as groupProps['childrenProps'])} />;
    case 'textArea':
      return <Input.TextArea {...(childrenProps as textAreaProps['childrenProps'])} />;
    case 'tree':
      return <FormTree {...(childrenProps as treeProps['childrenProps'])} />;
    case 'password':
      return <Input.Password autoComplete="new-password" {...(childrenProps as passwordProps['childrenProps'])} />;
    case 'select': {
      const { list, ...props } = childrenProps as selectProps['childrenProps'];
      return (
        <Select {...props} suffixIcon={<img src={grayArrow} style={{ transform: 'rotate(90deg)' }} />}>
          {list?.map(({ title, value }) => {
            return (
              <Select.Option key={value || title} value={value || title}>
                {title}
              </Select.Option>
            );
          })}
        </Select>
      );
    }
    case 'datePicker': {
      return <FormDatePiker {...(childrenProps as datePickerProps['childrenProps'])} />;
    }
    case 'timePicker':
      return <TimePicker style={{ width: '100%' }} {...(childrenProps as timePickerProps['childrenProps'])} />;
    case 'row':
      return <div {...(childrenProps as rowProps['childrenProps'])} />;
    case 'fileUpload':
      return <Upload {...(childrenProps as fileUploadProps['childrenProps'])}></Upload>;
    case 'searchSelect': {
      const { list, ...props } = childrenProps as selectProps['childrenProps'];
      return (
        <Select {...props} showSearch>
          {list?.map(({ title, value }) => {
            return (
              <Select.Option key={value || title} value={value || title}>
                {title}
              </Select.Option>
            );
          })}
        </Select>
      );
    }
    case 'inputNumber':
      return <InputNumber {...childrenProps} />;
    case 'pureText': {
      const { text, ...props } = childrenProps;
      return <div {...props}>{text}</div>;
    }
  }
}
const FormItem = memo(({ type, childrenProps, ...props }: Omit<FormItemProps, 'inlineFieldProps'>) => {
  if (type === 'customize') return <Form.Item {...props}>{props.children}</Form.Item>;
  const children = getChildren(type, childrenProps);
  return <Form.Item {...props}>{children}</Form.Item>;
});

export const FormFields = (formJson: FormItemProps[]) => {
  return formJson.map((field, index) => {
    if (field.type === 'inlineField') {
      const { type, inlineFieldList, flexProps, ...props } = field;
      return (
        <Form.Item {...props} key={`${index}-${type}`} style={{ marginBottom: 0 }}>
          <Flex align="center" {...flexProps}>
            {inlineFieldList.map((field, index) => (
              <FormItem key={index} {...field} />
            ))}
          </Flex>
        </Form.Item>
      );
    }

    if (field.type === 'fieldsGroup') {
      const { type, fieldsList, ...props } = field;
      return (
        <Form.Item key={`${index}-${type}`} style={{ marginBottom: 0 }} {...props}>
          {fieldsList.map((field, index) => (
            <FormItem key={index} {...field} />
          ))}
        </Form.Item>
      );
    }

    return <FormItem key={index} {...field} />;
  });
};

export default FormItem;
