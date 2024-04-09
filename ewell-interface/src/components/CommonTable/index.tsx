import clsx from 'clsx';
import { Table, ITableProps } from 'aelf-design';
import { Flex } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import SandGlassLoading from 'components/SandGlassLoading';
import { tableEmpty } from 'assets/images';
import './styles.less';

interface ICommonTableProps<T> extends ITableProps<T> {
  loading?: boolean;
}

export default function CommonTable<T extends AnyObject>(props: ICommonTableProps<T>) {
  return (
    <Table
      {...props}
      className={clsx('common-table', props.className)}
      locale={{
        emptyText: (
          <Flex className="table-empty-wrapper" vertical justify="center" align="center" gap={16}>
            <img src={tableEmpty} alt="empty" />
            <span className="table-empty-text">No Result Found</span>
          </Flex>
        ),
        ...props.locale,
      }}
      loading={{
        spinning: props.loading,
        wrapperClassName: 'table-loading-wrapper',
        indicator: (
          <div>
            <Flex className="table-loading" align="center" justify="center" gap={8}>
              <SandGlassLoading />
              <span>Search is ongoing...</span>
            </Flex>
          </div>
        ),
      }}
    />
  );
}
