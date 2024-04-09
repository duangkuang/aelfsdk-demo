import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import { useEffectOnce } from 'react-use';
import { useCardCol } from '../../hooks/useCardCol';
import ProjectCard from '../Card';
import { useGetList, IListData } from '../../hooks/useGetList';
import { ProjectType } from 'types/project';
import Empty from 'components/Empty';
import { emitLoading } from 'utils/events';
import InfiniteList from 'components/InfiniteList';
import myEvents from 'utils/myEvent';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useMobile } from 'contexts/useStore/hooks';
interface ProjectListProps {
  createdItems?: IListData['createdItems'];
  participateItems?: IListData['createdItems'];
}

const MyProjects: React.FC<ProjectListProps> = () => {
  const isMobile = useMobile();
  const [colNum] = useCardCol();
  const [loading, setLoading] = useState(true);
  const [createdItems, setCreatedItems] = useState<IListData['createdItems']>([]);
  const [participateItems, setParticipateItems] = useState<IListData['participateItems']>([]);
  const [loadAllParticipateItems, setLoadAllParticipateItems] = useState(false);
  const navigate = useNavigate();
  const { getList } = useGetList();

  const getCreatedProjects = useCallback(async () => {
    const { createdItems } = await getList({ types: ProjectType.CREATED });
    setCreatedItems(createdItems || []);
  }, [getList]);

  const getParticipateProject = useCallback(async () => {
    const list = await getList({
      types: ProjectType.PARTICIPATE,
      skipCount: participateItems.length,
      maxResultCount: colNum * 3,
    });

    if (list.participateItems.length === 0) return;
    const newList = participateItems.concat(list.participateItems);
    setParticipateItems(newList);
    setLoadAllParticipateItems(newList.length >= list.totalCount);
  }, [colNum, getList, participateItems]);

  useEffect(() => {
    emitLoading(loading);
  }, [loading]);

  useEffect(() => {
    return () => {
      emitLoading(false);
    };
  }, []);

  const initList = useCallback(async () => {
    await Promise.all([getCreatedProjects(), getParticipateProject()]);
    setLoading(false);
  }, [getCreatedProjects, getParticipateProject]);

  const initListRef = useRef(initList);
  initListRef.current = initList;
  useEffect(() => {
    const { remove } = myEvents.AuthToken.addListener(() => {
      initListRef.current?.();
    });
    return () => {
      remove();
    };
  }, []);

  useEffectOnce(() => {
    initList();
  });

  const emptyText = useMemo(() => {
    return (
      <div style={{ fontSize: 14, textAlign: 'center', padding: '0 17vw' }}>
        You haven't participated in any sales yet. Explore
        <span
          style={{ color: '#863DFF', fontWeight: 500, cursor: 'pointer' }}
          onClick={() => navigate('/projects/all')}>
          {' '}
          Projects
        </span>
        .
      </div>
    );
  }, [navigate]);

  return !loading ? (
    <div className="project-page">
      {!createdItems.length && !participateItems.length && (
        <>
          <div className="project-type">No Projects</div>
          <Empty className={clsx(isMobile ? 'mobile-project-empty-full' : 'project-empty-full')} text={emptyText} />
        </>
      )}
      {!!createdItems.length && (
        <>
          <div className="project-type">Created</div>
          <div className="project-list-wrapper">
            <Row gutter={[24, 24]}>
              {createdItems.map((item) => (
                <Col span={24 / colNum} key={item.id}>
                  <ProjectCard data={item} />
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
      {!!participateItems.length && (
        <InfiniteList
          id="project-list-scroll"
          showScrollToTop={false}
          loaded={loadAllParticipateItems}
          loadMoreData={getParticipateProject}
          dataLength={participateItems.length}>
          <div className="project-type">Participated</div>
          <div className="project-list-wrapper">
            <Row gutter={[24, 24]}>
              {participateItems.map((item) => (
                <Col span={24 / colNum} key={item.id}>
                  <ProjectCard data={item} />
                </Col>
              ))}
            </Row>
          </div>
        </InfiniteList>
      )}
    </div>
  ) : null;
};

export default MyProjects;
