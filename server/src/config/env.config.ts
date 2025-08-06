import dotenv from 'dotenv';
import { CustomError } from '../utils/errors/custom.error';
import { HttpResCode } from '../utils/constants/httpResponseCode.utils';
import { EnvErrMsg } from '../utils/constants/envErrorMsg.constants';

dotenv.config();

export const env = {
  get PORT(): number {
    const raw = process.env.PORT;
    if (!raw) {
      throw new CustomError(EnvErrMsg.PORT_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) {
      throw new CustomError(EnvErrMsg.PORT_INVALID, HttpResCode.BAD_REQUEST);
    }
    return parsed;
  },

  get NODE_ENV(): 'development' | 'production' | 'test' {
    const env = process.env.NODE_ENV;
    if (!env) {
      throw new CustomError(EnvErrMsg.NODE_ENV_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return env as 'development' | 'production' | 'test';
  },

  get CLIENT_ORIGIN(): string {
    const origin = process.env.ORIGIN;
    if (!origin) {
      throw new CustomError(EnvErrMsg.CLIENT_ORIGIN_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return origin;
  },

  get GOOGLE_APPLICATION_CREDENTIALS(): string {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credPath) {
      throw new CustomError('Google Application Credentials path is undefined.', HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return credPath;
  },
};
