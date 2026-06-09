import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, fetchBetWinCount, fetchWagerCheck, fetchKYCStatus } from '@/services/api/profileService.js';
import { getUID } from '@/utils';

export const useUserInfo = (enabled = true) => {
  const uid = getUID();
  return useQuery({
    queryKey: ['userInfo', uid],
    queryFn: fetchUserInfo,
    enabled: enabled && !!uid,
    staleTime: 60000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useBetWinCount = (enabled = true) => {
  const uid = getUID();
  return useQuery({
    queryKey: ['betWinCount', uid],
    queryFn: fetchBetWinCount,
    enabled: enabled && !!uid,
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useWagerCheck = (enabled = true) => {
  const uid = getUID();
  return useQuery({
    queryKey: ['wagerCheck', uid],
    queryFn: fetchWagerCheck,
    enabled: enabled && !!uid,
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useKYCStatus = (enabled = true) => {
  const uid = getUID();
  return useQuery({
    queryKey: ['kycStatus', uid],
    queryFn: fetchKYCStatus,
    enabled: enabled && !!uid,
    staleTime: 30000,
    retry: 1,
    retryDelay: 1000,
  });
};
