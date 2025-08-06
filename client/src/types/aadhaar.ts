import type { IAadhaarData } from "./IAadhaar";

export interface AadhaarResponse {
  success: boolean;
  status: number;
  message: string;
  data: IAadhaarData;
}


