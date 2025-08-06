/**
 * Interface representing the structured data extracted from an Aadhaar card.
 */
export interface IAadhaar {
  name: string;
  dob: string;
  gender: string;
  uid: string;
  address: string;
  pincode: string;
  age_band: string;
  isUidSame: boolean;
}

/**
 * Interface representing the full API response for a successful OCR process.
 */
export interface AadhaarResponse {
  status: boolean;
  message: string;
  data: IAadhaar;
}