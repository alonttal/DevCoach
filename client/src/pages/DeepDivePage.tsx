import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deepDiveApi } from '../api/deepdive';
import { challengeApi } from '../api/challenge';
import { DeepDive } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './DeepDivePage.module.css';

const stageColors: Record<string, string> = {
  Hold: '#ef4444',
  Assess: '#f59e0b',
  Trial: '#6366f1',
  Adopt: '#10b981',
};

export function DeepDivePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deepDive, setDeepDive] = useState<DeepDive | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    deepDiveApi
      .getById(id)
      .then(setDeepDive)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTakeChallenge = async () => {
    if (!deepDive) return;
    setChallengeLoading(true);
    try {
      const challenge = await challengeApi.generate(deepDive.id);
      navigate(`/challenge/${challenge.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChallengeLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!deepDive) return <ErrorMessage message="Deep dive not found" />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{deepDive.title}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What It Is</h2>
        <p className={styles.text}>{deepDive.whatItIs}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Relates to Your Stack</h2>
        <p className={styles.text}>{deepDive.stackRelationship}</p>
      </section>

      {deepDive.codeExamples.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Code Examples</h2>
          {deepDive.codeExamples.map((ex, i) => (
            <div key={i} className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>{ex.language}</span>
                <span className={styles.codeTitle}>{ex.title}</span>
              </div>
              <pre><code>{ex.code}</code></pre>
              <p className={styles.codeExplanation}>{ex.explanation}</p>
            </div>
          ))}
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Adoption Verdict</h2>
        <div className={styles.verdict}>
          <span
            className={styles.stage}
            style={{ color: stageColors[deepDive.adoptionVerdict.stage] }}
          >
            {deepDive.adoptionVerdict.stage}
          </span>
          <p className={styles.text}>{deepDive.adoptionVerdict.reasoning}</p>
        </div>
      </section>

      <button
        className={styles.challengeBtn}
        onClick={handleTakeChallenge}
        disabled={challengeLoading}
      >
        {challengeLoading ? 'Generating Challenge...' : 'Take Challenge'}
      </button>
    </div>
  );
}
