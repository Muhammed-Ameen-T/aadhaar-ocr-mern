import { injectable } from 'inversify';
import { IOcrService } from '../interfaces/services/IOcrService';
import { IAadhaar } from '../interfaces/IAadhaar';
import vision from '@google-cloud/vision';
import { CustomError } from '../utils/errors/custom.error';
import fs from 'fs/promises';
import { isAadhaarCardContentValid } from '../utils/aadhaarValidator.utils';
import { parseAadhaarData } from '../utils/dataParse.utils';
import { isValidAadhaar } from 'aadhaar-validator-ts';
import { ErrorMsg } from '../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../utils/constants/httpResponseCode.utils';

@injectable()
export class OcrService implements IOcrService {
  private client = new vision.ImageAnnotatorClient();

  /**
   * @method processAadhaar
   * @description Orchestrates the entire Aadhaar OCR process from image validation to data extraction.
   * @param {string} frontPath The file path of the front side Aadhaar image.
   * @param {string} backPath The file path of the back side Aadhaar image.
   * @returns {Promise<IAadhaar>} A promise that resolves to the extracted Aadhaar data.
   */
  public async processAadhaar(frontPath: string, backPath: string): Promise<IAadhaar> {
    try {
      const [frontText, backText] = await Promise.all([
        this.extractText(frontPath),
        this.extractText(backPath),
      ]);

      if (!isAadhaarCardContentValid(frontText, backText)) {
        throw new CustomError(ErrorMsg.INVALID_AADHAAR_CONTENT, HttpResCode.BAD_GATEWAY);
      }

      const parsedData = parseAadhaarData(frontText, backText);

      const isValid = isValidAadhaar(parsedData.uid_front);
      if (!isValid) {
        throw new CustomError(ErrorMsg.ADHAAR_NOT_VALID, HttpResCode.BAD_REQUEST);
      }

      const isUidSame = parsedData.uid_front === parsedData.uid_back;

      if (!isUidSame) {
        throw new CustomError(ErrorMsg.UID_MISMATCH, HttpResCode.BAD_GATEWAY);
      }

      return {
        name: parsedData.name,
        dob: parsedData.dob,
        gender: parsedData.gender,
        uid: parsedData.uid_front,
        address: parsedData.address,
        pincode: parsedData.pincode,
        age_band: parsedData.age_band,
        isUidSame,
      };
    } catch (error) {
      throw error;
    } finally {
      try {
        await Promise.all([fs.unlink(frontPath), fs.unlink(backPath)]);
      } catch (fileErr) {
        console.warn(ErrorMsg.FAILED_TO_CLEAN, { error: fileErr });
      }
    }
  }

  public async extractText(filePath: string): Promise<string> {
    const [result] = await this.client.textDetection(filePath);
    return result.fullTextAnnotation?.text || '';
  }
}