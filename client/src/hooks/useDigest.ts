import { useState, useEffect, useCallback } from 'react';
import { digestApi } from '../api/digest';
import { Digest } from '../types';

export function useDigest() {
  const [digest, setDigest] = useState<Digest | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const fetchLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await digestApi.getLatest();
      setDigest(data);
    } catch {
      setDigest(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLatest(); }, [fetchLatest]);

  const generate = async () => {
    setGenerating(true);
    setError(null);
    setProgressMessage(null);
    try {
      const data = await digestApi.generate((msg) => {
        setProgressMessage(msg);
      });
      setDigest(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setGenerating(false);
      setProgressMessage(null);
    }
  };

  return { digest, loading, generating, error, progressMessage, generate, refetch: fetchLatest };
}
