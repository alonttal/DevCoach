import { Router } from 'express';
import { create, getById } from '../controllers/deepdive.controller';

export const deepdiveRoutes = Router();

deepdiveRoutes.post('/', create);
deepdiveRoutes.get('/:id', getById);
