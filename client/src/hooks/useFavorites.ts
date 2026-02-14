import { useState, useEffect, useCallback } from 'react';
import { favoritesApi } from '../api/favorites';
import { FavoriteEntry, DigestItem } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favoritesApi.getAll();
      setFavorites(data);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const isFavorited = (digestItemId: string) =>
    favorites.some((f) => f.digestItemId === digestItemId);

  const toggle = async (item: DigestItem) => {
    const existing = favorites.find((f) => f.digestItemId === item.id);
    if (existing) {
      await favoritesApi.remove(existing.id);
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
    } else {
      const entry = await favoritesApi.add({
        digestItemId: item.id,
        title: item.title,
        url: item.url,
        layer: item.layer,
      });
      setFavorites((prev) => [...prev, entry]);
    }
  };

  return { favorites, loading, isFavorited, toggle, refetch: fetch };
}
