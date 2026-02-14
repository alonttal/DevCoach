import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './ProfilePage.module.css';

const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior', 'staff'] as const;

export function ProfilePage() {
  const { profile, loading, error, save } = useProfile();
  const [name, setName] = useState('');
  const [stackInput, setStackInput] = useState('');
  const [stack, setStack] = useState<string[]>([]);
  const [primaryLanguage, setPrimaryLanguage] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<typeof EXPERIENCE_LEVELS[number]>('mid');
  const [interestsInput, setInterestsInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setStack(profile.stack);
      setPrimaryLanguage(profile.primaryLanguage);
      setExperienceLevel(profile.experienceLevel);
      setInterests(profile.interests);
    }
  }, [profile]);

  if (loading) return <LoadingSpinner />;

  const handleAddStack = () => {
    const val = stackInput.trim();
    if (val && !stack.includes(val)) {
      setStack([...stack, val]);
      setStackInput('');
    }
  };

  const handleAddInterest = () => {
    const val = interestsInput.trim();
    if (val && !interests.includes(val)) {
      setInterests([...interests, val]);
      setInterestsInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await save({ name, stack, primaryLanguage, experienceLevel, interests });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled by hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Profile</h1>
      <p className={styles.subtitle}>
        Tell DevCoach about yourself to get personalized digests.
      </p>

      {error && <ErrorMessage message={error} />}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Primary Language</span>
          <input
            className={styles.input}
            value={primaryLanguage}
            onChange={(e) => setPrimaryLanguage(e.target.value)}
            placeholder="e.g. TypeScript"
            required
          />
        </label>

        <div className={styles.field}>
          <span className={styles.label}>Experience Level</span>
          <div className={styles.levelGroup}>
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`${styles.levelBtn} ${experienceLevel === level ? styles.levelActive : ''}`}
                onClick={() => setExperienceLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Tech Stack</span>
          <div className={styles.tagInput}>
            <input
              className={styles.input}
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStack())}
              placeholder="Add technology..."
            />
            <button type="button" className={styles.addBtn} onClick={handleAddStack}>
              Add
            </button>
          </div>
          <div className={styles.tags}>
            {stack.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => setStack(stack.filter((t) => t !== tag))}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Interests</span>
          <div className={styles.tagInput}>
            <input
              className={styles.input}
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
              placeholder="Add interest..."
            />
            <button type="button" className={styles.addBtn} onClick={handleAddInterest}>
              Add
            </button>
          </div>
          <div className={styles.tags}>
            {interests.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => setInterests(interests.filter((t) => t !== tag))}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
        </button>
      </form>

      {profile && Object.keys(profile.topicMastery).length > 0 && (
        <div className={styles.masterySection}>
          <h2 className={styles.subtitle}>Topic Mastery</h2>
          <div className={styles.masteryGrid}>
            {Object.entries(profile.topicMastery).map(([topic, score]) => (
              <div key={topic} className={styles.masteryItem}>
                <span className={styles.masteryTopic}>{topic}</span>
                <div className={styles.masteryBar}>
                  <div
                    className={styles.masteryFill}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={styles.masteryScore}>{score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
