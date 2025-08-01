import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const handleAxiosError = (
  error: unknown,
  fallbackMessage: string = 'Something went wrong.'
): void => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || fallbackMessage;

    // Show toast with contextual message
    if (statusCode === 400) {
      toast.error(`⚠️ ${errorMessage}`);
    } else if (statusCode === 401 || statusCode === 403) {
      toast.error(`🔒 Unauthorized: ${errorMessage}`);
    } else if (statusCode === 500) {
      toast.error(`🚨 Server error: ${errorMessage}`);
    } else {
      toast.error(`❌ ${errorMessage}`);
    }
  } else {
    // Non-Axios error fallback
    toast.error(`❗ ${fallbackMessage}`);
    console.error('Unhandled error type:', error);
  }
};
