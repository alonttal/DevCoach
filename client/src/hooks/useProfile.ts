import { useState, useEffect, useCallback } from 'react';
import { profileApi } from '../api/profile';
import { UserProfile } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileApi.get();
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (data: Omit<UserProfile, 'topicMastery' | 'updatedAt'>) => {
    setError(null);
    try {
      const updated = await profileApi.save(data);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { profile, loading, error, save, refetch: fetch };
}
