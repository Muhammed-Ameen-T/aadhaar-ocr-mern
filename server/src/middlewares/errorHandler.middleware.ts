import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CustomError } from '../utils/errors/custom.error';
import { sendResponse } from '../utils/response/sendResponse.utils';
import { HttpResCode, HttpResMsg } from '../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../utils/constants/commonErrorMsg.constants';

/**
 * @function errorHandler
 * @description A global error handling middleware to catch and standardize
 * error responses across the application.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return sendResponse(res, err.statusCode, err.message);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, HttpResCode.BAD_REQUEST, ErrorMsg.FILE_SIZE_TOOLARGE);
    }
  }

  return sendResponse(res, HttpResCode.INTERNAL_SERVER_ERROR, HttpResMsg.INTERNAL_SERVER_ERROR);
};