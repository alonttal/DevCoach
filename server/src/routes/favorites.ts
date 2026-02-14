import { Router } from 'express';
import { getAll, add, remove } from '../controllers/favorites.controller';

export const favoritesRoutes = Router();

favoritesRoutes.get('/', getAll);
favoritesRoutes.post('/', add);
favoritesRoutes.delete('/:id', remove);
