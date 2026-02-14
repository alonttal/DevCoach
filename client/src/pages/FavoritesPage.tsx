import { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DigestLayer } from '../types';
import styles from './FavoritesPage.module.css';

const LAYER_FILTERS: { value: DigestLayer | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'niche', label: 'Niche' },
  { value: 'core-stack', label: 'Core Stack' },
  { value: 'wildcard', label: 'Wildcard' },
];

const layerColors: Record<string, string> = {
  niche: 'var(--color-niche)',
  'core-stack': 'var(--color-core)',
  wildcard: 'var(--color-wildcard)',
};

export function FavoritesPage() {
  const { favorites, loading, toggle } = useFavorites();
  const [search, setSearch] = useState('');
  const [layerFilter, setLayerFilter] = useState<DigestLayer | 'all'>('all');

  if (loading) return <LoadingSpinner />;

  const filtered = favorites
    .filter((e) => {
      if (layerFilter !== 'all' && e.layer !== layerFilter) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Favorites</h1>

      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="Search favorites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {LAYER_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${layerFilter === f.value ? styles.filterActive : ''}`}
              onClick={() => setLayerFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {search || layerFilter !== 'all'
            ? 'No matching favorites.'
            : 'No favorites yet. Star items from your digest!'}
        </p>
      ) : (
        <div className={styles.list}>
          {filtered.map((entry) => (
            <div key={entry.id} className={styles.item}>
              <div className={styles.itemMain}>
                <span
                  className={styles.layerDot}
                  style={{ background: layerColors[entry.layer] }}
                />
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.itemTitle}
                >
                  {entry.title}
                </a>
              </div>
              <div className={styles.itemActions}>
                <span className={styles.itemDate}>
                  {new Date(entry.savedAt).toLocaleDateString()}
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={() =>
                    toggle({
                      id: entry.digestItemId,
                      title: entry.title,
                      url: entry.url,
                      layer: entry.layer,
                    } as any)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
