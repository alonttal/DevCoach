import { Request, Response, NextFunction } from 'express';
import { getRepositories } from '../repositories';
import { generateChallenge } from '../services/challenge.service';
import { AppError } from '../middleware/error-handler';
import { ChallengeSubmission } from '../types';

export async function generate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { deepDiveId } = req.body;
    if (!deepDiveId) {
      throw new AppError(400, 'deepDiveId is required');
    }

    const profile = await getRepositories().profile.get();
    if (!profile) {
      throw new AppError(400, 'Profile must be set up first');
    }

    const deepDive = await getRepositories().deepDive.getById(deepDiveId);
    if (!deepDive) {
      throw new AppError(404, 'Deep dive not found');
    }

    const challenge = await generateChallenge(deepDive, profile);
    await getRepositories().challenge.save(challenge);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
}

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new AppError(400, 'answers must be an array');
    }

    const challenge = await getRepositories().challenge.getById(id);
    if (!challenge) {
      throw new AppError(404, 'Challenge not found');
    }

    let score = 0;
    challenge.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });

    const submission: ChallengeSubmission = {
      challengeId: id,
      answers,
      score,
      total: challenge.questions.length,
      submittedAt: new Date().toISOString(),
    };

    await getRepositories().challenge.saveSubmission(submission);

    // Update topic mastery based on score
    const profile = await getRepositories().profile.get();
    if (profile) {
      const mastery = Math.round((score / challenge.questions.length) * 100);
      profile.topicMastery[challenge.title] = mastery;
      profile.updatedAt = new Date().toISOString();
      await getRepositories().profile.save(profile);
    }

    res.json(submission);
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
    const challenge = await getRepositories().challenge.getById(req.params.id as string);
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }
    res.json(challenge);
  } catch (err) {
    next(err);
  }
}
