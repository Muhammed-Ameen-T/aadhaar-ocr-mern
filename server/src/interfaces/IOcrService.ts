export interface IOcrService {
  extractText(filePath: string): Promise<string>;
  extractDetails(frontText: string, backText: string): {
    name: string;
    dob: string;
    gender: string;
    aadhaar: string;
    address: string;
  };
}
