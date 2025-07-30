import { inject, injectable } from 'inversify';
import { IOcrService } from '../interfaces/IOcrService.js';
import { TYPES } from '../types/types';
import fs from 'fs';
import { Request, Response } from 'express';

@injectable()
export class OcrController {
  constructor(@inject(TYPES.OcrService) private ocrService: IOcrService) {}

  async process(req: Request, res: Response): Promise<void> {
    try {
      const frontPath = req.files['front'][0].path;
      const backPath = req.files['back'][0].path;

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
