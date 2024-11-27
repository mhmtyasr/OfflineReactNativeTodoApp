import React, {createContext, useContext, useEffect} from 'react';
import BulkDataService from '../../offlineServices/services/bulkDataService';
import {usePostSyncData} from '@/hooks/queries/syncQuery';
import {useInterval} from 'react-interval-hook';
import {useInitializer} from '../Initializer';
import {getSyncData} from '@/services/sync';
import {useToast} from '../Toast';
import {getNowTimestampUtc} from '@/utils/dateUtils';
interface SyncContextProps {}

interface SyncProviderProps {
  children: React.ReactNode;
}

declare global {
  interface Global {
    runAllSync?: () => void;
  }

  var runAllSync: Global['runAllSync'];
}

global.runAllSync = undefined;

const SyncContext = createContext<SyncContextProps | undefined>(undefined);

export const SyncProvider: React.FC<SyncProviderProps> = ({children}) => {
  const {
    lastSyncTime,
    isSyncStarting,
    isBulkDataSending,
    isConnected,
    handleSetSyncStarting,
    handleSetBulkDataSending,
    handleSetLastSyncTime,
  } = useInitializer();

  const toast = useToast();
  const {mutate, isLoading} = usePostSyncData({
    onSuccess: () => {
      syncCheckerInterval.start();
      runAllSync();
    },
    onError: () => {},
  });

  const runAllSync = async () => {
    if (
      isConnected === true &&
      isBulkDataSending === false &&
      lastSyncTime &&
      isSyncStarting === false
    ) {
      handleSetSyncStarting(true);
      toast.show.info('Syncing Starting');
      await getSyncData(lastSyncTime!)
        .then(async x => {
          await BulkDataService.setSync(x);
          handleSetLastSyncTime(getNowTimestampUtc());
          handleSetSyncStarting(false);
          toast.show.success('Syncing Successfully');
        })
        .catch(() => {
          handleSetSyncStarting(false);
          toast.show.error('Syncing Failed');
        });
    }
  };

  global.runAllSync = runAllSync;

  const syncCheckerInterval = useInterval(
    () => {
      if (Date.now() - lastSyncTime! >= 600000) {
        runAllSync();
      }
    },
    2000,
    {
      autoStart: true,
      immediate: false,
    },
  );

  useEffect(() => {
    const handleSyncControl = async () => {
      if (isConnected === true && isLoading === false && lastSyncTime) {
        toast.show.info('Değişen datalar kontrol ediliyor');
        await BulkDataService.hasChangedDataInDb(lastSyncTime!).then(
          async hasChangedData => {
            handleSetBulkDataSending(false);
            if (hasChangedData) {
              toast.show.info('Değişen datalar gönderiliyor');
               syncCheckerInterval.stop();

              await BulkDataService.getAllBulkData(lastSyncTime!).then(x => {
                 mutate(x);
              });
            } else {
              handleSetBulkDataSending(false);
              syncCheckerInterval.start();
            }
          },
        );
      }
    };

    handleSyncControl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return children;
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
