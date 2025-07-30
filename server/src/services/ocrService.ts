import { injectable } from 'inversify';
import { IOcrService } from '../interfaces/IOcrService.js';
import vision from '@google-cloud/vision';

@injectable()
export class OcrService implements IOcrService {
  private client = new vision.ImageAnnotatorClient();

  async extractText(filePath: string): Promise<string> {
    const [result] = await this.client.textDetection(filePath);
    return result.fullTextAnnotation?.text || '';
  }

  extractDetails(frontText: string, backText: string) {
    const name = frontText.match(/(?<=Name\s*[:\-]?\s*)[A-Z ]{3,}/i)?.[0] || '';
    const dob = frontText.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || '';
    const gender = /female/i.test(frontText) ? 'Female' : /male/i.test(frontText) ? 'Male' : '';
    const aadhaar = frontText.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || '';
    const address = backText.replace(/\n/g, ' ').match(/(?<=Address[:\-]?\s*)(.*)/i)?.[0] || '';

    return { name, dob, gender, aadhaar, address };
  }
}
