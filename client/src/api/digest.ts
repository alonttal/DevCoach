import { api } from './client';
import { Digest } from '../types';

export type DigestProgressCallback = (message: string) => void;

export const digestApi = {
  generate: (onProgress?: DigestProgressCallback): Promise<Digest> => {
    return new Promise((resolve, reject) => {
      // Use fetch (not EventSource) since we need POST
      fetch('/api/digest/generate', {
        method: 'POST',
        headers: { Accept: 'text/event-stream' },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          function read(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) {
                reject(new Error('Stream ended without result'));
                return;
              }
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              let eventType = '';
              for (const line of lines) {
                if (line.startsWith('event: ')) {
                  eventType = line.slice(7);
                } else if (line.startsWith('data: ')) {
                  const data = JSON.parse(line.slice(6));
                  if (eventType === 'progress') {
                    onProgress?.(data.message);
                  } else if (eventType === 'done') {
                    resolve(data as Digest);
                    return;
                  } else if (eventType === 'error') {
                    reject(new Error(data.error));
                    return;
                  }
                }
              }
              return read();
            });
          }

          return read();
        })
        .catch(reject);
    });
  },

  getLatest: () => api.get<Digest>('/digest/latest'),
  getByDate: (date: string) => api.get<Digest>(`/digest/${date}`),
};
