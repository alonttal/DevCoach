import { DeepDive } from '../../types';
import { IDeepDiveRepository } from '../interfaces';
import { JsonFileAdapter } from './adapter';

interface DeepDiveStore {
  deepDives: DeepDive[];
}

export class DeepDiveJsonRepository implements IDeepDiveRepository {
  private adapter: JsonFileAdapter<DeepDiveStore>;

  constructor(dataDir: string) {
    this.adapter = new JsonFileAdapter(dataDir, 'deepdives.json');
  }

  private async getStore(): Promise<DeepDiveStore> {
    return (await this.adapter.read()) || { deepDives: [] };
  }

  async getById(id: string): Promise<DeepDive | null> {
    const store = await this.getStore();
    return store.deepDives.find((d) => d.id === id) || null;
  }

  async save(deepDive: DeepDive): Promise<void> {
    const store = await this.getStore();
    const idx = store.deepDives.findIndex((d) => d.id === deepDive.id);
    if (idx >= 0) {
      store.deepDives[idx] = deepDive;
    } else {
      store.deepDives.push(deepDive);
    }
    await this.adapter.write(store);
  }
}
