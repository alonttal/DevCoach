import styles from './StarToggle.module.css';

export function StarToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.star} ${active ? styles.active : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      {active ? '\u2605' : '\u2606'}
    </button>
  );
}
