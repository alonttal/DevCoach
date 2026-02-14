import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { challengeApi } from '../api/challenge';
import { Challenge, ChallengeSubmission } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './ChallengePage.module.css';

export function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submission, setSubmission] = useState<ChallengeSubmission | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    challengeApi
      .getById(id)
      .then((data) => {
        setChallenge(data);
        setAnswers(new Array(data.questions.length).fill(null));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (questionIdx: number, optionIdx: number) => {
    if (submission) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIdx] = optionIdx;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!challenge || !id) return;
    const unanswered = answers.some((a) => a === null);
    if (unanswered) return;

    setSubmitting(true);
    try {
      const result = await challengeApi.submit(id, answers as number[]);
      setSubmission(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!challenge) return <ErrorMessage message="Challenge not found" />;

  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{challenge.title}</h1>
      <p className={styles.subtitle}>
        {submission
          ? `Score: ${submission.score}/${submission.total}`
          : `${challenge.questions.length} questions`}
      </p>

      {submission && (
        <div
          className={styles.scoreBar}
          style={{
            background:
              submission.score / submission.total >= 0.8
                ? 'rgba(16, 185, 129, 0.15)'
                : submission.score / submission.total >= 0.5
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
          }}
        >
          <span className={styles.scoreText}>
            {submission.score === submission.total
              ? 'Perfect score!'
              : submission.score / submission.total >= 0.8
                ? 'Great job!'
                : submission.score / submission.total >= 0.5
                  ? 'Good effort!'
                  : 'Keep learning!'}
          </span>
        </div>
      )}

      <div className={styles.questions}>
        {challenge.questions.map((q, qi) => (
          <div key={q.id} className={styles.question}>
            <p className={styles.questionText}>
              {qi + 1}. {q.question}
            </p>
            <div className={styles.options}>
              {q.options.map((opt, oi) => {
                let cls = styles.option;
                if (submission) {
                  if (oi === q.correctIndex) cls += ` ${styles.correct}`;
                  else if (oi === answers[qi] && oi !== q.correctIndex)
                    cls += ` ${styles.wrong}`;
                } else if (answers[qi] === oi) {
                  cls += ` ${styles.selected}`;
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    onClick={() => handleSelect(qi, oi)}
                    disabled={!!submission}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submission && (
              <p className={styles.explanation}>{q.explanation}</p>
            )}
          </div>
        ))}
      </div>

      {!submission && (
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      )}
    </div>
  );
}
