import React, {createContext, useContext, useEffect, useState} from 'react';
import useDbInitializer from '@/hooks/useDbInitializer';
import SplashScreen from '../SplashScreen';
import {
  getLastSyncTimeFromStorage,
  setLastSyncTimeToStorage,
} from '@/utils/storageUtils';
import {Button, Text} from '@rneui/themed';
import {timestampToDateTime} from '@/utils/dateUtils';
import {View} from 'react-native';

interface InitializerontextProps {
  lastSyncTime: number | null;
  setLastSyncTime: (time: number) => void;
  isSyncStarting: boolean;
  isBulkDataSending: boolean;
  isConnected: boolean;
  handleSetSyncStarting: (isStarting: boolean) => void;
  handleSetBulkDataSending: (isSending: boolean) => void;
  handleSetLastSyncTime: (time: number) => void;
  setIsConnected: (isConnected: boolean) => void;
}

interface InitializerProviderProps {
  children: React.ReactNode;
}

const InitializerContext = createContext<InitializerontextProps | undefined>(
  undefined,
);

export const InitializerProvider: React.FC<InitializerProviderProps> = ({
  children,
}) => {
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [isSyncStarting, setIsSyncStarting] = useState<boolean | null>(false);
  const [isBulkDataSending, setIsBulkDataSending] = useState<boolean | null>(
    false,
  );
  const [isConnected, setIsConnected] = useState<boolean | null>(false);

  const handleRunInitialSync = async () => {
    const _lastSyncTime = await getLastSyncTimeFromStorage();

    setLastSyncTime(_lastSyncTime);
  };

  const handleSetSyncStarting = async (isStarting: boolean) => {
    setIsSyncStarting(isStarting);
  };

  const handleSetBulkDataSending = async (isSending: boolean) => {
    setIsBulkDataSending(isSending);
  };

  const handleSetLastSyncTime = async (time: number) => {
    setLastSyncTime(time);
    await setLastSyncTimeToStorage(time);
  };

  useEffect(() => {
    handleRunInitialSync();
  }, []);

  const {isDbReady} = useDbInitializer();

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => unsubscribe();
  // }, []);

  return isDbReady &&
    lastSyncTime !== null &&
    isSyncStarting !== null &&
    isBulkDataSending !== null &&
    isConnected !== null ? (
    <InitializerContext.Provider
      value={{
        lastSyncTime,
        setLastSyncTime,
        isSyncStarting,
        handleSetSyncStarting,
        isBulkDataSending,
        handleSetBulkDataSending,
        isConnected,
        handleSetLastSyncTime,
        setIsConnected,
      }}>
      <View>
        <Button
          onPress={() => {
            setIsConnected(!isConnected);
          }}
          color={isConnected ? 'primary' : 'error'}>
          {isConnected ? 'Online' : 'Offline'}
        </Button>
      </View>

      {children}
    </InitializerContext.Provider>
  ) : (
    <SplashScreen />
  );
};

export const useInitializer = () => {
  const context = useContext(InitializerContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
