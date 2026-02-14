import { Router } from 'express';
import { generate, getLatest, getByDate } from '../controllers/digest.controller';

export const digestRoutes = Router();

digestRoutes.post('/generate', generate);
digestRoutes.get('/latest', getLatest);
digestRoutes.get('/:date', getByDate);
