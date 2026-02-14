import { UserProfile } from '../../types';
import { IProfileRepository } from '../interfaces';
import { JsonFileAdapter } from './adapter';

export class ProfileJsonRepository implements IProfileRepository {
  private adapter: JsonFileAdapter<UserProfile>;

  constructor(dataDir: string) {
    this.adapter = new JsonFileAdapter(dataDir, 'profile.json');
  }

  async get(): Promise<UserProfile | null> {
    return this.adapter.read();
  }

  async save(profile: UserProfile): Promise<void> {
    await this.adapter.write(profile);
  }
}
