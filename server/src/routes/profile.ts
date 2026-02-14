import { Router } from 'express';
import {
  getProfile,
  saveProfile,
  updateTopicMastery,
} from '../controllers/profile.controller';

export const profileRoutes = Router();

profileRoutes.get('/', getProfile);
profileRoutes.put('/', saveProfile);
profileRoutes.patch('/topic/:topic', updateTopicMastery);
