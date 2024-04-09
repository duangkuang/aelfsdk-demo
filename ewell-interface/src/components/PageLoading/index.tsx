import React, { useState, useCallback, useEffect } from 'react';
import { Flex } from 'antd';
import { Loading, Typography } from 'aelf-design';
import SandGlassLoading from 'components/SandGlassLoading';
import myEvents from 'utils/myEvent';
import './styles.less';

const { Text } = Typography;

export interface ILoadingInfo {
  isLoading: boolean;
  text: string | React.ReactNode;
}

const DEFAULT_LOADING_TEXT = 'Loading...';

export default function PageLoading() {
  const [loadingInfo, setLoadingInfo] = useState<ILoadingInfo>({
    isLoading: false,
    text: DEFAULT_LOADING_TEXT,
  });

  const setLoadingHandler = useCallback(({ isLoading, text }: ILoadingInfo) => {
    setLoadingInfo({
      isLoading,
      text: text ?? DEFAULT_LOADING_TEXT,
    });
  }, []);

  useEffect(() => {
    const { remove } = myEvents.SetGlobalLoading.addListener(setLoadingHandler);
    return () => {
      remove();
    };
  }, [setLoadingHandler]);

  return (
    <Loading
      open={loadingInfo.isLoading}
      content={
        <Flex gap={8} align="flex-start">
          <SandGlassLoading className="page-loading-icon" />
          {!!loadingInfo.text && <Text>{loadingInfo.text}</Text>}
        </Flex>
      }
    />
  );
}
