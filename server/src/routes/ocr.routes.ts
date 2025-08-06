import { Router } from 'express';
import container from '../config/inversify.config';
import { IOcrController } from '../interfaces/controllers/IOcrController';
import { TYPES } from '../types/types';
import { aadhaarUpload } from '../middlewares/multerUpload.middleware';

const router = Router();
const controller = container.get<IOcrController>(TYPES.OcrController);

router.post(
  '/extract',
  aadhaarUpload,
  (req, res, next) => controller.process(req, res, next)
);

export default router;