import { api } from './client';
import { DeepDive } from '../types';

export const deepDiveApi = {
  create: (digestItemId: string) =>
    api.post<DeepDive>('/deepdive', { digestItemId }),
  getById: (id: string) => api.get<DeepDive>(`/deepdive/${id}`),
};
