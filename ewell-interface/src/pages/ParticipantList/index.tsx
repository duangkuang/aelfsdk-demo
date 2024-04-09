import { useCallback, useMemo, useRef, useState } from 'react';
import { Breadcrumb, Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HashAddress, Search, Pagination, Typography, FontWeightEnum } from 'aelf-design';
import CommonTable from 'components/CommonTable';
import './styles.less';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { request } from 'api';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import { divDecimalsStr } from 'utils/calculate';
import dayjs from 'dayjs';
import { useQuery } from 'hooks/useQuery';
import { stringifyUrl } from 'query-string';
import { useScreenSize } from 'contexts/useStore/hooks';
import { ScreenSize } from 'constants/theme';
import clsx from 'clsx';
import { ProjectListType } from 'types/project';
import { getExploreLink } from 'utils';
import { DEFAULT_TOKEN_INFO, DEFAULT_TOKEN_SYMBOL } from 'constants/misc';

const { Title, Text } = Typography;

type TParticipantItem = {
  key: string;
  order: string;
  address: string;
  investCount: string;
  time: string;
};

const DEFAULT_PAGE_SIZE = 10;
export default function ParticipantList() {
  const location = useLocation();
  const { from = ProjectListType.ALL } = (location.state || {}) as { from?: ProjectListType };
  const screenSize = useScreenSize();
  const isScreenLteLarge = useMemo(
    () =>
      screenSize === ScreenSize.MINI ||
      screenSize === ScreenSize.SMALL ||
      screenSize === ScreenSize.MEDIUM ||
      screenSize === ScreenSize.LARGE,
    [screenSize],
  );
  const isScreenLteSmall = useMemo(
    () => screenSize === ScreenSize.MINI || screenSize === ScreenSize.SMALL,
    [screenSize],
  );
  const isScreenLteMini = useMemo(() => screenSize === ScreenSize.MINI, [screenSize]);

  const [isTableLoading, setIsTableLoading] = useState(false);
  const { projectId = '' } = useParams();
  const [pager, setPager] = useState({
    page: 1,
    total: 0,
  });
  const [list, setList] = useState<TParticipantItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<string>();
  const [totalUserCount, setTotalUserCount] = useState<number>(0);
  const isSearchRef = useRef<boolean>(false);
  const [isSearch, setIsSearch] = useState(false);
  const [virtualAddress, setVirtualAddress] = useState<string>('');

  const { projectName = 'Project' } = useQuery();
  const [symbol, setSymbol] = useState<string>('');

  const fetchTimeRef = useRef<number>();
  const getWhitelistInfo = useCallback(
    async (page = 1, address?: string) => {
      setIsTableLoading(true);
      try {
        let fetchTime = Date.now();
        fetchTimeRef.current = fetchTime;
        const skipCount = (page - 1) * DEFAULT_PAGE_SIZE;
        const { data } = await request.project.getProjectUserList({
          params: {
            chainId: DEFAULT_CHAIN_ID,
            projectId: projectId,
            skipCount: (page - 1) * DEFAULT_PAGE_SIZE,
            maxResultCount: DEFAULT_PAGE_SIZE,
            address: address,
          },
        });
        if (fetchTime < fetchTimeRef.current) return;
        console.log('data', data);
        isSearchRef.current = !!address;
        setVirtualAddress(data?.virtualAddress || '');
        setIsSearch(!!address);

        const symbol = data?.toRaiseToken?.symbol || DEFAULT_TOKEN_SYMBOL;
        setSymbol(symbol);
        const decimals = data?.toRaiseToken?.decimals || DEFAULT_TOKEN_INFO.decimals;

        const _list = data?.users?.map((item, idx) => ({
          key: `${skipCount + idx + 1}`,
          order: `${skipCount + idx + 1}`,
          address: item.address,
          investCount: divDecimalsStr(item.investAmount, decimals),
          time: dayjs(item.createTime ?? 0).format('HH:mm:ss DD/MM/YYYY'),
        }));
        setList(_list);
        setTotalAmount(divDecimalsStr(data?.totalAmount || '', decimals));
        setTotalUserCount(data?.totalUser || 0);
        setPager({
          page,
          total: data.totalCount,
        });
      } catch (error) {
        console.log('getWhitelistInfo error', error);
      }
      setIsTableLoading(false);
    },
    [projectId],
  );

  useEffectOnce(() => {
    getWhitelistInfo();
  });

  const onPageChange = useCallback(
    (page) => {
      getWhitelistInfo(page);
    },
    [getWhitelistInfo],
  );

  const onSearch = useCallback(
    (e: any) => {
      const address = e.target.value.trim();
      if (address) {
        getWhitelistInfo(1, address);
      } else {
        getWhitelistInfo();
      }
    },
    [getWhitelistInfo],
  );

  const onClear = useCallback(() => {
    if (isSearchRef.current) {
      getWhitelistInfo();
    }
  }, [getWhitelistInfo]);

  const breadList = useMemo(
    () => [
      {
        title: <NavLink to={`/projects/${from}`}>{from === ProjectListType.MY && 'My '}Projects</NavLink>,
      },
      {
        title: (
          <NavLink
            to={stringifyUrl({
              url: `/project/${projectId}`,
              query: {
                projectName,
              },
            })}
            state={{ from }}>
            {projectName}
          </NavLink>
        ),
      },
      {
        title: 'Participants',
      },
    ],
    [from, projectId, projectName],
  );

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'order',
        key: 'order',
        className: 'order-column',
        width: '8%',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        className: 'address-column',
        width: '52%',
        render: (address) => (
          <HashAddress
            ignorePrefixSuffix={true}
            preLen={isScreenLteLarge ? 8 : 0}
            endLen={isScreenLteLarge ? 9 : 0}
            address={address}
            addressClickCallback={(_, address) => {
              const exploreLink = address ? getExploreLink(address) : '';
              if (exploreLink) {
                window.open(exploreLink, '_blank');
              }
            }}
          />
        ),
      },
      {
        title: `${symbol} Raised`,
        dataIndex: 'investCount',
        key: 'investCount',
        className: 'invest-count-column',
        width: '24%',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        className: 'time-column',
        width: '16%',
      },
    ],
    [isScreenLteLarge, symbol],
  );

  return (
    <div className="common-page page-body participant-list-wrapper">
      <Breadcrumb className="bread-wrap" items={breadList}></Breadcrumb>
      <Flex
        className="participant-header"
        justify="space-between"
        align={isScreenLteSmall ? 'stretch' : 'flex-end'}
        gap={24}
        vertical={isScreenLteSmall}>
        <Flex vertical>
          <Title level={5} fontWeight={FontWeightEnum.Medium}>
            Participants
          </Title>
          {!!virtualAddress && (
            <Flex vertical={isScreenLteLarge}>
              <Text className="margin-right-8">Tokens stored at</Text>
              <HashAddress
                preLen={isScreenLteLarge ? 8 : 0}
                endLen={isScreenLteLarge ? 9 : 0}
                chain={DEFAULT_CHAIN_ID}
                address={virtualAddress}
                addressClickCallback={(_, address) => {
                  const exploreLink = address ? getExploreLink(address) : '';
                  if (exploreLink) {
                    window.open(exploreLink, '_blank');
                  }
                }}
              />
            </Flex>
          )}
        </Flex>
        <Search
          inputClassName={clsx('address-search', { ['full-width']: isScreenLteSmall })}
          placeholder="Enter address and search"
          onBlur={onSearch}
          onClear={onClear}
        />
      </Flex>
      <CommonTable
        className="table"
        loading={isTableLoading}
        scroll={{
          x: true,
        }}
        columns={columns}
        dataSource={list}
      />
      <Flex justify="space-between" align={isScreenLteMini ? 'stretch' : 'center'} gap={16} vertical={isScreenLteMini}>
        <Flex gap={16}>
          <Text size="small">
            Total number of participants:{' '}
            <Text size="small" fontWeight={FontWeightEnum.Medium}>
              {totalUserCount}
            </Text>
          </Text>
          {symbol && (
            <Text size="small">
              Total amount of {symbol} raised:{' '}
              <Text size="small" fontWeight={FontWeightEnum.Medium}>
                {totalAmount}
              </Text>
            </Text>
          )}
        </Flex>
        {!isSearch && (
          <Pagination
            current={pager.page}
            total={pager.total}
            pageSize={DEFAULT_PAGE_SIZE}
            showSizeChanger={false}
            pageChange={onPageChange}
          />
        )}
      </Flex>
    </div>
  );
}
