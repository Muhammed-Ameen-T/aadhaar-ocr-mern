import { Router } from 'express';
import multer from 'multer';
import container from '../config/inversify.config';
import { OcrController } from '../controllers/ocrController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

const controller = container.get<OcrController>(OcrController);

router.post(
  '/extract',
  upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]),
  (req, res) => controller.process(req, res)
);

export default router;
