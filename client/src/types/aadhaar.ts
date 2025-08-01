import type { IAadhaarData } from "./IAadhaarData";

export interface AadhaarResponse {
  success: boolean;
  status: number;
  message: string;
  data: IAadhaarData;
}


