import { Request, Response, NextFunction } from 'express';
import { getRepositories } from '../repositories';
import { generateDigest } from '../services/digest.service';
import { AppError } from '../middleware/error-handler';

export async function generate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const useSSE = req.headers.accept === 'text/event-stream';

  if (useSSE) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const profile = await getRepositories().profile.get();
      if (!profile) {
        sendEvent('error', { error: 'Profile must be set up before generating a digest' });
        res.end();
        return;
      }

      const digest = await generateDigest(profile, (message) => {
        sendEvent('progress', { message });
      });

      await getRepositories().digest.save(digest);
      sendEvent('done', digest);
      res.end();
    } catch (err: any) {
      sendEvent('error', { error: err.message || 'Internal server error' });
      res.end();
    }
    return;
  }

  // Non-SSE fallback
  try {
    const profile = await getRepositories().profile.get();
    if (!profile) {
      throw new AppError(400, 'Profile must be set up before generating a digest');
    }

    const digest = await generateDigest(profile);
    await getRepositories().digest.save(digest);
    res.json(digest);
  } catch (err) {
    next(err);
  }
}

export async function getLatest(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const digest = await getRepositories().digest.getLatest();
    if (!digest) {
      res.status(404).json({ error: 'No digests found' });
      return;
    }
    res.json(digest);
  } catch (err) {
    next(err);
  }
}

export async function getByDate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const date = req.params.date as string;
    const digest = await getRepositories().digest.getByDate(date);
    if (!digest) {
      res.status(404).json({ error: `No digest found for ${date}` });
      return;
    }
    res.json(digest);
  } catch (err) {
    next(err);
  }
}
