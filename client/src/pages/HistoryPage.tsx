import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { LoadingSpinner } from '../components/LoadingSpinner';
import styles from './HistoryPage.module.css';

export function HistoryPage() {
  const { history, loading } = useHistory();
  const [search, setSearch] = useState('');

  if (loading) return <LoadingSpinner />;

  const filtered = history
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reading History</h1>
      <input
        className={styles.search}
        placeholder="Search history..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {search ? 'No matching entries.' : 'No reading history yet.'}
        </p>
      ) : (
        <div className={styles.list}>
          {filtered.map((entry) => (
            <a
              key={entry.id}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.item}
            >
              <span className={styles.itemTitle}>{entry.title}</span>
              <span className={styles.itemDate}>
                {new Date(entry.openedAt).toLocaleDateString()}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
