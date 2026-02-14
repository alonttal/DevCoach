import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDigest } from '../hooks/useDigest';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import { deepDiveApi } from '../api/deepdive';
import { DigestCard } from '../components/DigestCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { DigestLayer } from '../types';
import styles from './DigestPage.module.css';

const LAYERS: DigestLayer[] = ['niche', 'core-stack', 'wildcard'];
const LAYER_TITLES: Record<DigestLayer, string> = {
  niche: 'Your Niche',
  'core-stack': 'Core Stack',
  wildcard: 'Wildcard',
};

export function DigestPage() {
  const { digest, loading, generating, error, progressMessage, generate } = useDigest();
  const { isFavorited, toggle } = useFavorites();
  const { record } = useHistory();
  const navigate = useNavigate();
  const [deepDiveLoading, setDeepDiveLoading] = useState<string | null>(null);
  const [deepDiveError, setDeepDiveError] = useState<string | null>(null);

  const handleDeepDive = async (digestItemId: string) => {
    setDeepDiveLoading(digestItemId);
    setDeepDiveError(null);
    try {
      const dd = await deepDiveApi.create(digestItemId);
      navigate(`/deepdive/${dd.id}`);
    } catch (err: any) {
      setDeepDiveError(err.message || 'Failed to generate deep dive');
    } finally {
      setDeepDiveLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily Digest</h1>
          {digest && (
            <p className={styles.date}>{digest.date}</p>
          )}
        </div>
        <button
          className={styles.generateBtn}
          onClick={generate}
          disabled={generating}
        >
          {generating ? 'Generating...' : digest ? 'Refresh' : 'Generate Digest'}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={generate} />}

      {generating && <LoadingSpinner message={progressMessage || "Generating your personalized digest with Claude..."} />}

      {!generating && !digest && !error && (
        <div className={styles.empty}>
          <p>No digest yet. Click "Generate Digest" to get your personalized developer news.</p>
          <p className={styles.hint}>Make sure to set up your profile first!</p>
        </div>
      )}

      {deepDiveError && <ErrorMessage message={deepDiveError} />}
      {deepDiveLoading && <LoadingSpinner message="Generating deep dive..." />}

      {digest && !generating && (
        <div className={styles.layers}>
          {LAYERS.map((layer) => {
            const items = digest.items.filter((i) => i.layer === layer);
            if (items.length === 0) return null;
            return (
              <section key={layer} className={styles.section}>
                <h2 className={styles.sectionTitle}>{LAYER_TITLES[layer]}</h2>
                <div className={styles.cards}>
                  {items.map((item) => (
                    <DigestCard
                      key={item.id}
                      item={item}
                      isFavorited={isFavorited(item.id)}
                      onToggleFavorite={() => toggle(item)}
                      onOpen={() =>
                        record({
                          digestItemId: item.id,
                          title: item.title,
                          url: item.url,
                        })
                      }
                      onDeepDive={handleDeepDive}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
