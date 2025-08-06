import { IAadhaar } from '../IAadhaar';

/**
 * @interface IOcrService
 * @description Defines the contract for the OCR service.
 */
export interface IOcrService {
  processAadhaar(frontPath: string, backPath: string): Promise<IAadhaar>;
  extractText(filePath: string): Promise<string>;
}