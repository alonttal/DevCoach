import { api } from './client';
import { FavoriteEntry, DigestLayer } from '../types';

export const favoritesApi = {
  getAll: () => api.get<FavoriteEntry[]>('/favorites'),
  add: (entry: { digestItemId: string; title: string; url: string; layer: DigestLayer }) =>
    api.post<FavoriteEntry>('/favorites', entry),
  remove: (id: string) => api.delete<void>(`/favorites/${id}`),
};
