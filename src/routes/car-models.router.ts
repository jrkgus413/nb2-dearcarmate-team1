import { Router } from 'express';
import { getCarModels } from '../controllers/car-models.controller';

const router = Router();

router.get('cars/models', getCarModels);

export default router;
