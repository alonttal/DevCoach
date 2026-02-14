import { Request, Response, NextFunction } from 'express';
import { getRepositories } from '../repositories';
import { AppError } from '../middleware/error-handler';

export async function getProfile(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const profile = await getRepositories().profile.get();
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function saveProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, stack, primaryLanguage, experienceLevel, interests } =
      req.body;
    if (!name || !stack || !primaryLanguage || !experienceLevel) {
      throw new AppError(400, 'Missing required profile fields');
    }

    const existing = await getRepositories().profile.get();
    const profile = {
      name,
      stack,
      primaryLanguage,
      experienceLevel,
      interests: interests || [],
      topicMastery: existing?.topicMastery || {},
      updatedAt: new Date().toISOString(),
    };

    await getRepositories().profile.save(profile);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateTopicMastery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const topic = req.params.topic as string;
    const { mastery } = req.body;

    if (typeof mastery !== 'number' || mastery < 0 || mastery > 100) {
      throw new AppError(400, 'Mastery must be a number between 0 and 100');
    }

    const profile = await getRepositories().profile.get();
    if (!profile) {
      throw new AppError(404, 'Profile not found');
    }

    profile.topicMastery[topic] = mastery;
    profile.updatedAt = new Date().toISOString();
    await getRepositories().profile.save(profile);

    res.json(profile);
  } catch (err) {
    next(err);
  }
}
