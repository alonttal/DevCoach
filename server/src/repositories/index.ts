import fs from 'fs/promises';
import {
  IProfileRepository,
  IDigestRepository,
  IDeepDiveRepository,
  IChallengeRepository,
  IHistoryRepository,
  IFavoritesRepository,
} from './interfaces';
import { ProfileJsonRepository } from './json/profile.repository';
import { DigestJsonRepository } from './json/digest.repository';
import { DeepDiveJsonRepository } from './json/deepdive.repository';
import { ChallengeJsonRepository } from './json/challenge.repository';
import { HistoryJsonRepository } from './json/history.repository';
import { FavoritesJsonRepository } from './json/favorites.repository';

export interface Repositories {
  profile: IProfileRepository;
  digest: IDigestRepository;
  deepDive: IDeepDiveRepository;
  challenge: IChallengeRepository;
  history: IHistoryRepository;
  favorites: IFavoritesRepository;
}

let repos: Repositories;

export function getRepositories(): Repositories {
  if (!repos) throw new Error('Repositories not initialized');
  return repos;
}

export async function initRepositories(dataDir: string): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });

  repos = {
    profile: new ProfileJsonRepository(dataDir),
    digest: new DigestJsonRepository(dataDir),
    deepDive: new DeepDiveJsonRepository(dataDir),
    challenge: new ChallengeJsonRepository(dataDir),
    history: new HistoryJsonRepository(dataDir),
    favorites: new FavoritesJsonRepository(dataDir),
  };
}
