import { Router } from 'express';
import { getAll, record } from '../controllers/history.controller';

export const historyRoutes = Router();

historyRoutes.get('/', getAll);
historyRoutes.post('/', record);
