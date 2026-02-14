import { api } from './client';
import { HistoryEntry } from '../types';

export const historyApi = {
  getAll: () => api.get<HistoryEntry[]>('/history'),
  record: (entry: { digestItemId: string; title: string; url: string }) =>
    api.post<HistoryEntry>('/history', entry),
};
