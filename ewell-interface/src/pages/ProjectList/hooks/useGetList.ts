import { useCallback, useState } from 'react';
import { request } from 'api';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import { ProjectStatus, ProjectType } from 'types/project';
import { IProjectInfo } from '../components/Card/types';

interface IListParams {
  chainId?: string;
  projectId?: string;
  status?: ProjectStatus;
  types?: ProjectType;
  skipCount?: number;
  maxResultCount?: number;
}

interface IResult<T = any> {
  code: string;
  data: T;
  message: string;
}

export interface IListData {
  totalCount: number;
  detail?: IProjectInfo;
  activeItems: Array<IProjectInfo>;
  closedItems: Array<IProjectInfo>;
  createdItems: Array<IProjectInfo>;
  participateItems: Array<IProjectInfo>;
}

export const useGetList = () => {
  const getList = useCallback(async (params: IListParams) => {
    try {
      const { code, data, message }: IResult<IListData> = await request.project.getProjectList({
        params: {
          chainId: DEFAULT_CHAIN_ID,
          ...params,
        },
      });

      if (code === '20000') {
        return data;
      }
      console.log('geist-error', message);
      return {
        totalCount: 0,
        activeItems: [],
        closedItems: [],
        createdItems: [],
        participateItems: [],
      };
    } catch (error: any) {
      console.log('geist-error', error.message);
      return {
        totalCount: 0,
        activeItems: [],
        closedItems: [],
        createdItems: [],
        participateItems: [],
      };
    }
  }, []);

  return { getList };
};
