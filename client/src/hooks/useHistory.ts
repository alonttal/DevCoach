import { useState, useEffect, useCallback } from 'react';
import { historyApi } from '../api/history';
import { HistoryEntry } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await historyApi.getAll();
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const record = async (entry: { digestItemId: string; title: string; url: string }) => {
    const created = await historyApi.record(entry);
    setHistory((prev) => [...prev, created]);
  };

  return { history, loading, record, refetch: fetch };
}
