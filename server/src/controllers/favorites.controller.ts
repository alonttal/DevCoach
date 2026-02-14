import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { getRepositories } from '../repositories';
import { AppError } from '../middleware/error-handler';

export async function getAll(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const entries = await getRepositories().favorites.getAll();
    res.json(entries);
  } catch (err) {
    next(err);
  }
}

export async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const { digestItemId, title, url, layer } = req.body;
    if (!digestItemId || !title || !url) {
      throw new AppError(400, 'digestItemId, title, and url are required');
    }

    const entry = {
      id: uuid(),
      digestItemId,
      title,
      url,
      layer: layer || 'wildcard',
      savedAt: new Date().toISOString(),
    };

    await getRepositories().favorites.add(entry);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await getRepositories().favorites.remove(req.params.id as string);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
