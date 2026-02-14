import { FavoriteEntry } from '../../types';
import { IFavoritesRepository } from '../interfaces';
import { JsonFileAdapter } from './adapter';

interface FavoritesStore {
  entries: FavoriteEntry[];
}

export class FavoritesJsonRepository implements IFavoritesRepository {
  private adapter: JsonFileAdapter<FavoritesStore>;

  constructor(dataDir: string) {
    this.adapter = new JsonFileAdapter(dataDir, 'favorites.json');
  }

  private async getStore(): Promise<FavoritesStore> {
    return (await this.adapter.read()) || { entries: [] };
  }

  async getAll(): Promise<FavoriteEntry[]> {
    const store = await this.getStore();
    return store.entries;
  }

  async add(entry: FavoriteEntry): Promise<void> {
    const store = await this.getStore();
    store.entries.push(entry);
    await this.adapter.write(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.getStore();
    store.entries = store.entries.filter((e) => e.id !== id);
    await this.adapter.write(store);
  }
}
