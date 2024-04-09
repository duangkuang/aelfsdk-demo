import { ILoadingInfo } from 'components/PageLoading';
import myEvents from './myEvent';

export const emitLoading = (isLoading: boolean, loadingInfo?: Omit<ILoadingInfo, 'isLoading'>) =>
  myEvents.SetGlobalLoading.emit({
    isLoading,
    ...loadingInfo,
  });

export const emitSyncTipsModal = (isOpen: boolean) => myEvents.SetGlobalSyncTipsModal.emit(isOpen);
