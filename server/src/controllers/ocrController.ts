import { inject, injectable } from 'inversify';
import { IOcrController } from '../interfaces/controllers/IOcrController';
import { IOcrService } from '../interfaces/services/IOcrService';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../types/types';
import { sendResponse } from '../utils/response/sendResponse.utils';
import { CustomError } from '../utils/errors/custom.error';
import { HttpResCode } from '../utils/constants/httpResponseCode.utils';
import { SuccessMsg } from '../utils/constants/commonSuccessMsg.constants';
import { ErrorMsg } from '../utils/constants/commonErrorMsg.constants';

@injectable()
export class OcrController implements IOcrController {
  constructor(@inject(TYPES.OcrService) private ocrService: IOcrService) {}

  /**
   * @method process
   * @description Handles the OCR request, validates files, and delegates processing to the service.
   * @param {Request} req Express request object.
   * @param {Response} res Express response object.
   * @param {NextFunction} next Express next middleware function.
   */
  public async process(req: Request, res: Response, next: NextFunction): Promise<void> {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const frontFile = files?.front?.[0];
    const backFile = files?.back?.[0];

    if (!frontFile || !backFile) {
      return next(new CustomError(ErrorMsg.FRONT_AND_BACK_REQUIRED, HttpResCode.BAD_REQUEST));
    }

    try {
      const result = await this.ocrService.processAadhaar(frontFile.path, backFile.path);
      sendResponse(res, HttpResCode.OK, SuccessMsg.PARSING_SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }
}