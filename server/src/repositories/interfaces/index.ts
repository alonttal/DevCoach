import {
  UserProfile,
  Digest,
  DeepDive,
  Challenge,
  ChallengeSubmission,
  HistoryEntry,
  FavoriteEntry,
} from '../../types';

export interface IProfileRepository {
  get(): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
}

export interface IDigestRepository {
  getByDate(date: string): Promise<Digest | null>;
  getLatest(): Promise<Digest | null>;
  save(digest: Digest): Promise<void>;
}

export interface IDeepDiveRepository {
  getById(id: string): Promise<DeepDive | null>;
  save(deepDive: DeepDive): Promise<void>;
}

export interface IChallengeRepository {
  getById(id: string): Promise<Challenge | null>;
  save(challenge: Challenge): Promise<void>;
  saveSubmission(submission: ChallengeSubmission): Promise<void>;
  getSubmission(challengeId: string): Promise<ChallengeSubmission | null>;
}

export interface IHistoryRepository {
  getAll(): Promise<HistoryEntry[]>;
  add(entry: HistoryEntry): Promise<void>;
}

export interface IFavoritesRepository {
  getAll(): Promise<FavoriteEntry[]>;
  add(entry: FavoriteEntry): Promise<void>;
  remove(id: string): Promise<void>;
}
