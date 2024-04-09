import { Statistic, StatisticProps } from 'antd';
import { FontWeightEnum, Typography, ITextProps } from 'aelf-design';
import { formatCountdown, countdownValueType, FormatConfig, Formatter } from 'antd/lib/statistic/utils';
import dayjs from 'dayjs';
import * as React from 'react';

const { Text } = Typography;

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

interface CountdownProps extends StatisticProps {
  textProps?: ITextProps;
  value?: countdownValueType;
  onFinish?: () => void;
  onChange?: (value?: countdownValueType) => void;
}

function getTime(value?: countdownValueType) {
  return new Date(value as any).getTime();
}

class BaseCountdown extends React.Component<CountdownProps, {}> {
  countdownId?: number;

  get refreshInterval() {
    const { value } = this.props;
    const timestamp = getTime(value);
    const remainingTime = timestamp - Date.now();

    if (remainingTime <= ONE_DAY_IN_MS) {
      return 1000;
    } else {
      return 1000 * 60;
    }
  }

  componentDidMount() {
    this.syncTimer();
  }

  componentDidUpdate() {
    this.syncTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  syncTimer = () => {
    const { value } = this.props;

    const timestamp = getTime(value);
    if (timestamp >= Date.now()) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  };

  startTimer = () => {
    if (this.countdownId) return;

    const { onChange, value } = this.props;
    const timestamp = getTime(value);

    this.countdownId = window.setInterval(() => {
      this.forceUpdate();

      if (onChange && timestamp > Date.now()) {
        onChange(timestamp - Date.now());
      }
    }, this.refreshInterval);
  };

  stopTimer = () => {
    const { onFinish, value } = this.props;
    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = undefined;

      const timestamp = getTime(value);
      if (onFinish && timestamp < Date.now()) {
        onFinish();
      }
    }
  };

  formatCountdown = (value: countdownValueType, config: FormatConfig) => {
    if (!dayjs(value).isValid()) return <span>error</span>;
    const now = Date.now();
    const timestamp = getTime(value);
    const remainingTime = timestamp - now;
    let format;
    if (remainingTime <= ONE_DAY_IN_MS) {
      format = 'HH:mm:ss';
    } else {
      format = 'Dd HHh';
    }
    const formatData = formatCountdown(value, { ...config, format });

    return (
      <Text fontWeight={FontWeightEnum.Medium} {...this.props.textProps}>
        {formatData}
      </Text>
    );
  };

  render() {
    return <Statistic {...this.props} formatter={this.formatCountdown as Formatter} />;
  }
}

export default BaseCountdown;
