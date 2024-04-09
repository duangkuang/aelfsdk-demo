import { List, Divider, ListProps, Spin } from 'antd';
import ToTop from 'components/ToTop';
import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './styles.less';
export interface InfiniteListProps<T> {
  id?: string;
  dataSource?: T[];
  renderItem?: ListProps<T>['renderItem'];
  loadMoreData?: (update?: boolean) => void;
  className?: string;
  style?: CSSProperties;
  loaded?: boolean;
  itemLayout?: ListProps<T>['itemLayout'];
  showEndMessage?: boolean;
  children?: ReactNode;
  dataLength?: number;
  showScrollToTop?: boolean;
  scrollToTopShowHeight?: number;
}
const options: any = {
  top: 0,
  behavior: 'smooth',
};
export default function InfiniteList<T>({
  id = 'scrollableDiv',
  renderItem,
  loadMoreData,
  dataSource,
  className,
  style,
  loaded = true,
  showEndMessage = false,
  itemLayout,
  children,
  dataLength,
  showScrollToTop = true,
  scrollToTopShowHeight = 2000,
}: InfiniteListProps<T>) {
  const e = useRef<HTMLElement | null>();
  const [showScrollTo, setShowScrollTo] = useState<boolean>();
  useEffect(() => {
    e.current = document.getElementById(id);
  }, [id]);
  const onScroll = useCallback(() => {
    if (!showScrollToTop) return;
    const scrollTop = e.current?.scrollTop;
    if (scrollTop && scrollTop > scrollToTopShowHeight) setShowScrollTo(true);
    else setShowScrollTo(false);
  }, [scrollToTopShowHeight, showScrollToTop]);
  return (
    <>
      <InfiniteScroll
        scrollableTarget={id}
        dataLength={dataSource?.length || dataLength || 0}
        next={() => {
          if (loaded) return;
          loadMoreData?.();
        }}
        onScroll={onScroll}
        hasMore={!loaded}
        style={{ overflow: 'visible' }}
        loader={<Spin className="infinite-loader" tip={'loading...'} />}
        endMessage={showEndMessage && <Divider plain>loaded</Divider>}>
        {children ? children : <List itemLayout={itemLayout} dataSource={dataSource} renderItem={renderItem} />}
      </InfiniteScroll>
      {showScrollTo && showScrollToTop && (
        <ToTop onClick={() => e.current?.scrollTo(options)} className="infinite-scroll-to-top" />
      )}
    </>
  );
}
