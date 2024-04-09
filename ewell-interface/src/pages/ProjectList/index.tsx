import React from 'react';
import Projects from './components/Projects';
import MyProjects from './components/MyProjects';
import { useParams } from 'react-router-dom';
import './styles.less';

const ProjectList: React.FC = () => {
  const { type } = useParams();
  return <div className="common-page page-body project-list">{type === 'my' ? <MyProjects /> : <Projects />}</div>;
};

export default ProjectList;
