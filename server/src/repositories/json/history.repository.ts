import { HistoryEntry } from '../../types';
import { IHistoryRepository } from '../interfaces';
import { JsonFileAdapter } from './adapter';

interface HistoryStore {
  entries: HistoryEntry[];
}

export class HistoryJsonRepository implements IHistoryRepository {
  private adapter: JsonFileAdapter<HistoryStore>;

  constructor(dataDir: string) {
    this.adapter = new JsonFileAdapter(dataDir, 'history.json');
  }

  private async getStore(): Promise<HistoryStore> {
    return (await this.adapter.read()) || { entries: [] };
  }

  async getAll(): Promise<HistoryEntry[]> {
    const store = await this.getStore();
    return store.entries;
  }

  async add(entry: HistoryEntry): Promise<void> {
    const store = await this.getStore();
    store.entries.push(entry);
    await this.adapter.write(store);
  }
}
