import api from '../config/axios.config';
import { OCR_ENDPOINTS } from '../constants/endpoints.ts';
import { handleAxiosError } from '../utils/handleError.utils';
import { OCR_MESSAGES } from '../constants/messages';
import type { AadhaarResponse } from '../types/aadhaar.ts';

export const processAadhaarOcr = async (
  frontFile: File,
  backFile: File
): Promise<AadhaarResponse> => {
  const formData = new FormData();
  formData.append('front', frontFile);
  formData.append('back', backFile);

  try {
    const response = await api.post(OCR_ENDPOINTS.process, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("🚀 ~ processAadhaarOcr ~ response.data:", response.data)
    return response.data;
  } catch (error) {
    handleAxiosError(error, OCR_MESSAGES.PROCESSING_FAILED);
     return {
      success: false,
      status: 500,
      message: OCR_MESSAGES.PROCESSING_FAILED,
      data: {
        name: '',
        dob: '',
        gender: 'Other',
        aadhaar: '',
        address: '',
      },
    };
  }
};
