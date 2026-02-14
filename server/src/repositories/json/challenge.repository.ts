import { Challenge, ChallengeSubmission } from '../../types';
import { IChallengeRepository } from '../interfaces';
import { JsonFileAdapter } from './adapter';

interface ChallengeStore {
  challenges: Challenge[];
  submissions: ChallengeSubmission[];
}

export class ChallengeJsonRepository implements IChallengeRepository {
  private adapter: JsonFileAdapter<ChallengeStore>;

  constructor(dataDir: string) {
    this.adapter = new JsonFileAdapter(dataDir, 'challenges.json');
  }

  private async getStore(): Promise<ChallengeStore> {
    return (
      (await this.adapter.read()) || { challenges: [], submissions: [] }
    );
  }

  async getById(id: string): Promise<Challenge | null> {
    const store = await this.getStore();
    return store.challenges.find((c) => c.id === id) || null;
  }

  async save(challenge: Challenge): Promise<void> {
    const store = await this.getStore();
    const idx = store.challenges.findIndex((c) => c.id === challenge.id);
    if (idx >= 0) {
      store.challenges[idx] = challenge;
    } else {
      store.challenges.push(challenge);
    }
    await this.adapter.write(store);
  }

  async saveSubmission(submission: ChallengeSubmission): Promise<void> {
    const store = await this.getStore();
    store.submissions.push(submission);
    await this.adapter.write(store);
  }

  async getSubmission(challengeId: string): Promise<ChallengeSubmission | null> {
    const store = await this.getStore();
    const subs = store.submissions.filter((s) => s.challengeId === challengeId);
    return subs.length > 0 ? subs[subs.length - 1] : null;
  }
}
