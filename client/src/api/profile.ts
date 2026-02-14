import { api } from './client';
import { UserProfile } from '../types';

export const profileApi = {
  get: () => api.get<UserProfile>('/profile'),
  save: (profile: Omit<UserProfile, 'topicMastery' | 'updatedAt'>) =>
    api.put<UserProfile>('/profile', profile),
  updateTopicMastery: (topic: string, mastery: number) =>
    api.patch<UserProfile>(`/profile/topic/${encodeURIComponent(topic)}`, { mastery }),
};
