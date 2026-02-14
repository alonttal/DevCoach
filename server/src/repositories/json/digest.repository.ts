import { Digest } from '../../types';
import { IDigestRepository } from '../interfaces';
import { JsonFileAdapter } from './adapter';

interface DigestStore {
  digests: Digest[];
}

export class DigestJsonRepository implements IDigestRepository {
  private adapter: JsonFileAdapter<DigestStore>;

  constructor(dataDir: string) {
    this.adapter = new JsonFileAdapter(dataDir, 'digests.json');
  }

  private async getStore(): Promise<DigestStore> {
    return (await this.adapter.read()) || { digests: [] };
  }

  async getByDate(date: string): Promise<Digest | null> {
    const store = await this.getStore();
    return store.digests.find((d) => d.date === date) || null;
  }

  async getLatest(): Promise<Digest | null> {
    const store = await this.getStore();
    if (store.digests.length === 0) return null;
    return store.digests[store.digests.length - 1];
  }

  async save(digest: Digest): Promise<void> {
    const store = await this.getStore();
    const idx = store.digests.findIndex((d) => d.date === digest.date);
    if (idx >= 0) {
      store.digests[idx] = digest;
    } else {
      store.digests.push(digest);
    }
    await this.adapter.write(store);
  }
}
