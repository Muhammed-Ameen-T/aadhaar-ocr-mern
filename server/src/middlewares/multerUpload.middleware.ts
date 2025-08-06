import multer from 'multer';
import { CustomError } from '../utils/errors/custom.error';
import { HttpResCode } from '../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../utils/constants/commonErrorMsg.constants';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new CustomError(ErrorMsg.ALLOWED_FILE_TYPE, HttpResCode.BAD_REQUEST));
    }
  }
});

/**
 * @constant aadhaarUpload
 * @description Multer middleware for uploading two files named 'front' and 'back'.
 */
export const aadhaarUpload = upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]);