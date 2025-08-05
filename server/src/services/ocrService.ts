import { injectable } from 'inversify';
import { IOcrService } from '../interfaces/services/IOcrService';
import vision from '@google-cloud/vision';

@injectable()
export class OcrService implements IOcrService {
  private client = new vision.ImageAnnotatorClient();

  async extractText(filePath: string): Promise<string> {
    const [result] = await this.client.textDetection(filePath);
    return result.fullTextAnnotation?.text || '';
  }

  extractDetails(frontText: string, backText: string) {
    const lines = frontText.split('\n').map(line => line.trim()).filter(Boolean);

    // Step 1: Get clean DOB index, ignoring Aadhaar issue dates
    const dobIndex = lines.findIndex(line =>
      /\d{2}\/\d{2}\/\d{4}/.test(line) && !/issued|aadhaar/i.test(line)
    );

    const name = dobIndex > 0 ? lines[dobIndex - 1] : '';
    const dob = dobIndex >= 0 ? (lines[dobIndex].match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || '') : '';

    // Step 2: Get gender after DOB
    const genderLine = dobIndex + 1 < lines.length ? lines[dobIndex + 1] : '';
    const gender =
      /female/i.test(genderLine) ? 'Female' :
      /male/i.test(genderLine) ? 'Male' :
      '';

    // Step 3: Aadhaar extraction
    const aadhaar = frontText.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || '';

    // Step 4: Clean address block
    let rawAddress = backText.replace(/\n/g, ' ').trim();

    // Remove UIDAI intro text (in Hindi or English)
    rawAddress = rawAddress.replace(/.*(Address[:\-]?\s*)/i, '').trim();

    // Extract pincode and cut the tail after that
    const pinMatch = rawAddress.match(/\b\d{6}\b/);
    if (pinMatch) {
      const cutoff = rawAddress.indexOf(pinMatch[0]) + pinMatch[0].length;
      rawAddress = rawAddress.slice(0, cutoff).trim();
    }

    // Step 5: Guardian name logic
    let guardianName = '';
    const sOregex = /S\/O\s*([\w\s.]+)/i;
    const matchSO = backText.match(sOregex);
    if (matchSO) {
      guardianName = matchSO[1].trim();
    } else {
      // If S/O not found, extract first word block before first comma as fallback
      const addressParts = rawAddress.split(',');
      if (addressParts.length > 0 && /^[A-Za-z\s.]+$/.test(addressParts[0])) {
        guardianName = addressParts[0].trim();
        rawAddress = addressParts.slice(1).join(',').trim();
      }
    }

    return {
      name,
      dob,
      gender,
      aadhaar,
      address: rawAddress,
      guardianName
    };
  }

}
