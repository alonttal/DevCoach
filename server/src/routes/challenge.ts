import { Router } from 'express';
import {
  generate,
  submit,
  getById,
} from '../controllers/challenge.controller';

export const challengeRoutes = Router();

challengeRoutes.post('/generate', generate);
challengeRoutes.post('/:id/submit', submit);
challengeRoutes.get('/:id', getById);
