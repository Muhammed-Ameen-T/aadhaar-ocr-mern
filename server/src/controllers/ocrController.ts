import { inject, injectable } from 'inversify';
import { IOcrService } from '../interfaces/services/IOcrService';
import { TYPES } from '../types/types';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { sendResponse } from '../utils/response/sendResponse.utils';
import { HttpResCode, HttpResMsg } from '../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../utils/constants/commonErrorMsg.constants';
import { IOcrController } from '../interfaces/controllers/IOcrController';
import logger from '../utils/logger/logger.utils';
import { isValidAadhaar } from 'aadhaar-validator-ts';
import { CustomError } from '../utils/errors/custom.error';

@injectable()
export class OcrController implements IOcrController {
  constructor(@inject(TYPES.OcrService) private ocrService: IOcrService) {}

  async process(req: Request, res: Response): Promise<void> {
    console.log('Processing OCR request', req.files);
    if (
      !req.files ||
      typeof req.files !== 'object' ||
      !('front' in req.files) ||
      !('back' in req.files)
    ) {
      sendResponse(res, HttpResCode.BAD_REQUEST, ErrorMsg.MISSING_REQUIRED_FIELDS);
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const frontPath = files['front']?.[0]?.path;
    const backPath = files['back']?.[0]?.path;

    if (!frontPath || !backPath) {
      sendResponse(res, HttpResCode.BAD_REQUEST, ErrorMsg.MISSING_REQUIRED_FIELDS);
      return;
    }

    try {
      const [frontText, backText] = await Promise.all([
        this.ocrService.extractText(frontPath),
        this.ocrService.extractText(backPath),
      ]);

      const data = this.ocrService.extractDetails(frontText, backText);
      const isValid = isValidAadhaar(data.aadhaar);
      if (!isValid) {
        sendResponse(res, HttpResCode.BAD_REQUEST, ErrorMsg.ADHAAR_NOT_VALID);
      }
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, data);
    } catch (err) {
      logger.error('OCR processing failed', { error: err });
      sendResponse(res, HttpResCode.INTERNAL_SERVER_ERROR, HttpResMsg.INTERNAL_SERVER_ERROR);
    } finally {
      try {
        await Promise.all([fs.unlink(frontPath), fs.unlink(backPath)]);
      } catch (fileErr) {
        logger.warn('Failed to clean up uploaded files', { error: fileErr });
      }
    }
  }
}
