import { api } from './client';
import { Challenge, ChallengeSubmission } from '../types';

export const challengeApi = {
  generate: (deepDiveId: string) =>
    api.post<Challenge>('/challenge/generate', { deepDiveId }),
  getById: (id: string) => api.get<Challenge>(`/challenge/${id}`),
  submit: (id: string, answers: number[]) =>
    api.post<ChallengeSubmission>(`/challenge/${id}/submit`, { answers }),
};
