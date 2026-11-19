import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api-client';

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 2,
      },
    },
  });
};