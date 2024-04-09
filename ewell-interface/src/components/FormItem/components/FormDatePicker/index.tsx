import { CalendarOutlined } from '@ant-design/icons';
import {
  DatePickerForMobile,
  DatePickerForPC,
  Input,
  TDatePickerPropsForMobile,
  TDatePickerPropsForPC,
} from 'aelf-design';
import { useMobile } from 'contexts/useStore/hooks';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss [UTC] Z';

type TDateFn = () => Date;
type TDateMobile = string | Date | TDateFn;

interface IBaseDatePickerProps {
  value?: Dayjs | string;
  disabled?: boolean;
  onChange?: (current: Dayjs) => void;
}

type TDatePickerMobileProps = IBaseDatePickerProps & {
  min?: TDateMobile;
  max?: TDateMobile;
  format?: string;
} & Omit<TDatePickerPropsForMobile, 'value' | 'visible' | 'onConfirm' | 'onCancel' | 'min' | 'max'>;

type IDatePickerPCProps = Omit<TDatePickerPropsForPC, 'onChange' | 'value' | 'disabled'> & IBaseDatePickerProps;

const adjustToDate = (date?: TDateMobile) => {
  if (!date) return undefined;
  if (typeof date === 'string') return new Date(date);
  if (typeof date === 'function') return date();

  return undefined;
};

export const DatePickerMobile: React.FC<TDatePickerMobileProps> = ({
  value,
  onChange,
  format,
  disabled,
  min,
  max,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const timeStr = value ? dayjs(value).format(format || DEFAULT_DATE_FORMAT) : '';
    setInputValue(timeStr);
  }, [format, value]);

  const onConfirm = useCallback(
    (current: Date) => {
      setInputValue(dayjs(current).format(format || DEFAULT_DATE_FORMAT));
      onChange?.(dayjs(current));
      setOpen(false);
    },
    [format, onChange],
  );

  return (
    <>
      <Input
        readOnly
        allowClear={false}
        disabled={disabled}
        suffix={<CalendarOutlined />}
        value={inputValue}
        onClick={() => setOpen(true)}
      />
      <DatePickerForMobile
        precision="second"
        min={adjustToDate(min)}
        max={adjustToDate(max)}
        visible={open}
        onCancel={() => setOpen(false)}
        onConfirm={onConfirm}
        mouseWheel
        {...props}
      />
    </>
  );
};

export const DatePikerPC: React.FC<IDatePickerPCProps> = ({ value, disabled, onChange, format, ...props }) => {
  const _value = useMemo(() => {
    return value ? dayjs(value) : null;
  }, [value]);

  const _onChange = useCallback(
    (current, dateStr) => {
      onChange?.(current);
    },
    [onChange],
  );
  return (
    <DatePickerForPC
      disabled={disabled}
      format={format || DEFAULT_DATE_FORMAT}
      value={_value}
      onChange={_onChange}
      style={{ width: '100%' }}
      {...props}
    />
  );
};

export interface IFormDatePickerProps extends IBaseDatePickerProps {
  pcProps?: Omit<TDatePickerPropsForPC, 'onChange' | 'value' | 'disabled'> & any;
  // pcProps?: TDatePickerPropsForPC;
  mobileProps?: TDatePickerMobileProps;
}

const FormDatePicker = ({ pcProps, mobileProps, ...baseProps }: IFormDatePickerProps) => {
  const isMobile = useMobile();
  return isMobile ? <DatePickerMobile {...baseProps} {...mobileProps} /> : <DatePikerPC {...baseProps} {...pcProps} />;
};

export default FormDatePicker;
