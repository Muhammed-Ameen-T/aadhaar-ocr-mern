import { inject, injectable } from 'inversify';
import { IOcrService } from '../interfaces/IOcrService';
import { TYPES } from '../types/types';
import fs from 'fs';
import { Request, Response } from 'express';

@injectable()
export class OcrController {
  constructor(@inject(TYPES.OcrService) private ocrService: IOcrService) {}

  async process(req: Request, res: Response): Promise<void> {
    try {
      if (
        !req.files ||
        typeof req.files !== 'object' ||
        !('front' in req.files) ||
        !('back' in req.files)
      ) {
        res.status(400).json({ error: 'Missing required files' });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const frontPath = files['front']?.[0]?.path;
      const backPath = files['back']?.[0]?.path;

      if (!frontPath || !backPath) {
        res.status(400).json({ error: 'Missing file paths' });
        return;
      }

      const frontText = await this.ocrService.extractText(frontPath);
      const backText = await this.ocrService.extractText(backPath);
      const data = this.ocrService.extractDetails(frontText, backText);

      res.json(data);

      fs.unlinkSync(frontPath);
      fs.unlinkSync(backPath);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Processing failed' });
    }
  }
}
