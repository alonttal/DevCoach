import { Request, Response, NextFunction } from 'express';
import { getRepositories } from '../repositories';
import { generateDeepDive } from '../services/deepdive.service';
import { AppError } from '../middleware/error-handler';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { digestItemId } = req.body;
    if (!digestItemId) {
      throw new AppError(400, 'digestItemId is required');
    }

    const profile = await getRepositories().profile.get();
    if (!profile) {
      throw new AppError(400, 'Profile must be set up first');
    }

    // Find the digest item
    const latestDigest = await getRepositories().digest.getLatest();
    const item = latestDigest?.items.find((i) => i.id === digestItemId);
    if (!item) {
      throw new AppError(404, 'Digest item not found');
    }

    const deepDive = await generateDeepDive(item, profile);
    await getRepositories().deepDive.save(deepDive);
    res.json(deepDive);
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const deepDive = await getRepositories().deepDive.getById(req.params.id as string);
    if (!deepDive) {
      res.status(404).json({ error: 'Deep dive not found' });
      return;
    }
    res.json(deepDive);
  } catch (err) {
    next(err);
  }
}
