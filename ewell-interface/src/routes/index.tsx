import { useRoutes } from 'react-router-dom';
import Home from 'pages/Home';
import ProjectList from 'pages/ProjectList';
import ProjectInfo from 'pages/ProjectInfo';
import ParticipantList from 'pages/ParticipantList';
import WhitelistUsers from 'pages/WhitelistUsers';
import CreateProject from 'pages/CreateProject';
import EditInformation from 'pages/EditInformation';
import PortkeyAssets from 'pages/PortkeyAssets';

export const PageRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/projects/:type',
      element: <ProjectList />,
    },
    {
      path: '/project/:projectId',
      element: <ProjectInfo />,
    },
    {
      path: '/participant-list/:projectId',
      element: <ParticipantList />,
    },
    {
      path: '/whitelist-users/:whitelistId',
      element: <WhitelistUsers />,
    },
    {
      path: '/create-project',
      element: <CreateProject />,
    },
    {
      path: '/edit-information/:projectId',
      element: <EditInformation />,
    },
    {
      path: '/assets',
      element: <PortkeyAssets />,
    },
    {
      path: '*',
      element: <Home />,
    },
  ]);
