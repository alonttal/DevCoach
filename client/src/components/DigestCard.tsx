import { useNavigate } from 'react-router-dom';
import { DigestItem } from '../types';
import { StarToggle } from './StarToggle';
import styles from './DigestCard.module.css';

const layerColors: Record<string, string> = {
  niche: 'var(--color-niche)',
  'core-stack': 'var(--color-core)',
  wildcard: 'var(--color-wildcard)',
};

const layerLabels: Record<string, string> = {
  niche: 'Niche',
  'core-stack': 'Core Stack',
  wildcard: 'Wildcard',
};

export function DigestCard({
  item,
  isFavorited,
  onToggleFavorite,
  onOpen,
  onDeepDive,
}: {
  item: DigestItem;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onDeepDive: (id: string) => void;
}) {
  const navigate = useNavigate();

  const handleDeepDive = async () => {
    onDeepDive(item.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span
          className={styles.layer}
          style={{ color: layerColors[item.layer] }}
        >
          {layerLabels[item.layer]}
        </span>
        <StarToggle active={isFavorited} onClick={onToggleFavorite} />
      </div>
      <h3 className={styles.title}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={onOpen}>
          {item.title}
        </a>
      </h3>
      <p className={styles.summary}>{item.summary}</p>
      <p className={styles.why}>{item.whyItMatters}</p>
      <div className={styles.footer}>
        <span className={styles.source}>{item.source}</span>
        <div className={styles.topics}>
          {item.topics.slice(0, 3).map((t) => (
            <span key={t} className={styles.topic}>{t}</span>
          ))}
        </div>
        <button className={styles.diveBtn} onClick={handleDeepDive}>
          Deep Dive
        </button>
      </div>
    </div>
  );
}
