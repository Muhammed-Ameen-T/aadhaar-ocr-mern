import { Request, Response } from 'express';

export interface IOcrController {
  process(req: Request, res: Response): Promise<void>;
}
