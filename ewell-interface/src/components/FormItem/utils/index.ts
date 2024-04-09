import type { FormItemProps } from '..';
import type { inputProps, textAreaProps } from '../types';
import type { FormItemProps as antFormItemProps } from 'antd';

type Options = {
  label?: string;
  name?: string;
  required?: boolean;
} & antFormItemProps;

function unifyOptions<T extends Options>(
  option: T,
): Options & {
  childrenProps?: any;
} {
  if (typeof option === 'string') {
    return {
      label: option,
    };
  } else {
    return option;
  }
}

export function getInputOptions(
  option:
    | string
    | (Options & {
        childrenProps?: inputProps['childrenProps'];
      }),
): inputProps & FormItemProps {
  const { label, name, required = true, childrenProps, ...props } = unifyOptions(option);
  return {
    type: 'input',
    label: label,
    name: name || label,
    rules: required ? [{ required: true, message: 'Please enter the necessary information' }] : [],
    childrenProps: {
      // placeholder: `Please enter`,
      ...childrenProps,
    },
    ...props,
  };
}

export function getTextAreaOptions(option: string | Options): textAreaProps & FormItemProps {
  const { label, name, required = true } = unifyOptions(option);
  return {
    type: 'textArea',
    label: label,
    name: name || label,
    rules: required ? [{ required: true, message: `Please enter ${label}!` }] : [],
    childrenProps: {
      // placeholder: `Please enter ${label}`,
    },
  };
}

export function normFile(e: any) {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
}
