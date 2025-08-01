import { Router } from 'express';
import multer from 'multer';
import container from '../config/inversify.config';
import { IOcrController } from '../interfaces/controllers/IOcrController';
import { TYPES } from '../types/types';

const router = Router();
const upload = multer({ dest: 'src/uploads/' });

const controller = container.get<IOcrController>(TYPES.OcrController);

router.post(
  '/extract',
  upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]),
  (req, res) => controller.process(req, res)
);

export default router;
