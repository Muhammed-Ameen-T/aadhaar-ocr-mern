import { Request, Response, NextFunction } from 'express';

/**
 * @interface IOcrController
 * @description Defines the contract for the OCR controller,
 * including the Express middleware signature.
 */
export interface IOcrController {
  process(req: Request, res: Response, next: NextFunction): Promise<void>;
}