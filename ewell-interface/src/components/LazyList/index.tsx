import InfiniteList, { InfiniteListProps } from 'components/InfiniteList';
import { useCallback, useMemo, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';

interface LazyListProps<T> extends InfiniteListProps<T> {
  loadNumber?: number;
  dataSource: T[];
}
export default function LazyList<T>({
  dataSource,
  itemLayout = 'horizontal',
  loadNumber = 20,
  ...props
}: LazyListProps<T>) {
  const [data, setData] = useState<T[]>([]);

  const loadMoreData = useCallback(
    (update?: boolean) => {
      const list = update ? [] : data;
      const totalLength = dataSource?.length;
      const currentLength = list.length;
      if (currentLength < totalLength) {
        const start = currentLength;
        const currentEnd = currentLength + loadNumber;
        const end = totalLength < currentEnd ? totalLength : currentEnd;
        setData(list.concat(dataSource.slice(start, end)));
      }
    },
    [dataSource, data, loadNumber],
  );

  const loaded = useMemo(() => data.length >= dataSource.length, [data.length, dataSource.length]);

  useDeepCompareEffect(() => {
    loadMoreData(true);
  }, [dataSource || []]);

  return (
    <InfiniteList
      {...props}
      dataSource={dataSource}
      loadMoreData={loadMoreData}
      loaded={loaded}
      itemLayout={itemLayout}
    />
  );
}
