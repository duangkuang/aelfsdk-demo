import { ProjectStatus } from 'types/project';

export const PROJECT_STATUS_TEXT_MAP = {
  [ProjectStatus.UPCOMING]: 'Upcoming',
  [ProjectStatus.PARTICIPATORY]: 'Ongoing',
  [ProjectStatus.UNLOCKED]: 'Filled',
  [ProjectStatus.ENDED]: 'Ended',
  [ProjectStatus.CANCELED]: 'Cancelled',
};
