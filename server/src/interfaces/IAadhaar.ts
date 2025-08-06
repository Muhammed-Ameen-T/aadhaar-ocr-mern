/**
 * @interface IAadhaar
 * @description Represents the structured data extracted from an Aadhaar card.
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