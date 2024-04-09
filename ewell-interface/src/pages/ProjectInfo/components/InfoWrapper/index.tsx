import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import { Typography, FontWeightEnum, Carousel } from 'aelf-design';
import ProjectLogo from 'components/ProjectLogo';
import CommonCommunityLogoList, { COMMUNITY_LOGO_LIST } from 'components/CommonCommunityLogoList';
import EditButton from '../OperationComponents/EditButton';
import ProjectTabs from '../ProjectTabs';
import ActionCard from '../ActionCard';
import { IProjectInfo } from 'types/project';
import { pick } from 'utils';
import './styles.less';

const { Title, Text } = Typography;

interface IInfoWrapperProps {
  projectInfo: IProjectInfo;
  isPreview: boolean;
  isLogin: boolean;
  canEdit: boolean;
  isMobileStyle: boolean;
  handleRefresh: () => void;
}

const MAX_THUMBS_SLIDES_PER_VIEW = 5;

export default function InfoWrapper({
  projectInfo,
  isPreview,
  isLogin,
  canEdit,
  isMobileStyle,
  handleRefresh,
}: IInfoWrapperProps) {
  const { projectId } = useParams();

  const { additionalInfo } = projectInfo;

  const projectImgs = useMemo(() => {
    return (additionalInfo?.projectImgs?.split(',') || []).map((item, index) => ({
      id: index,
      url: item,
    }));
  }, [additionalInfo?.projectImgs]);

  const thumbsSlidesPerView = useMemo(() => {
    if (projectImgs.length > MAX_THUMBS_SLIDES_PER_VIEW) {
      return MAX_THUMBS_SLIDES_PER_VIEW;
    }
    return projectImgs.length;
  }, [projectImgs.length]);

  return (
    <div className="project-info-wrapper flex">
      <Flex justify="space-between" align="flex-start">
        <ProjectLogo src={additionalInfo?.logoUrl} alt="logo" />
        {canEdit && isMobileStyle && (
          <EditButton size="small" projectId={projectId} projectName={additionalInfo?.projectName}>
            Edit Project
          </EditButton>
        )}
      </Flex>
      <div className="info-wrapper flex-1 flex-column">
        <div className="info-header flex-column">
          <Title level={5} fontWeight={FontWeightEnum.Medium}>
            {additionalInfo?.projectName || '--'}
          </Title>
          <CommonCommunityLogoList communityLink={pick(additionalInfo || {}, COMMUNITY_LOGO_LIST)} />
          {!!additionalInfo?.projectSummary && <Text>{additionalInfo?.projectSummary}</Text>}
        </div>
        {projectImgs.length > 0 && (
          <Carousel className="carousel" thumbsSlidesPerView={thumbsSlidesPerView} data={projectImgs} />
        )}
        {isMobileStyle && (
          <ActionCard
            projectInfo={projectInfo}
            isPreview={isPreview}
            isLogin={isLogin}
            canEdit={canEdit}
            isMobileStyle={isMobileStyle}
            handleRefresh={handleRefresh}
          />
        )}
        <ProjectTabs projectInfo={projectInfo} />
      </div>
    </div>
  );
}
