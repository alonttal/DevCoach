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
    const entries = await getRepositories().history.getAll();
    res.json(entries);
  } catch (err) {
    next(err);
  }
}

export async function record(req: Request, res: Response, next: NextFunction) {
  try {
    const { digestItemId, title, url } = req.body;
    if (!digestItemId || !title || !url) {
      throw new AppError(400, 'digestItemId, title, and url are required');
    }

    const entry = {
      id: uuid(),
      digestItemId,
      title,
      url,
      openedAt: new Date().toISOString(),
    };

    await getRepositories().history.add(entry);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
}
