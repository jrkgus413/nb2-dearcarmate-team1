import multer from 'multer';
import { BadRequestError } from '../types/error.type';

const memoryStorage = multer.memoryStorage();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const customFileFilter = (allowedExtList: string[]): multer.Options['fileFilter'] => {
  return (_req, file, callback) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
    if (allowedExtList.includes(ext)) {
      callback(null, true);
    } else {
      callback(new BadRequestError('허용되지 않은 파일 확장자입니다.'));
    }
  };
};

export const imageUploader = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: customFileFilter(['jpg', 'jpeg', 'png']),
});

export const csvUploader = multer({ storage: memoryStorage, fileFilter: customFileFilter(['csv']) });

export const fileUploader = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: customFileFilter(['jpg', 'jpeg', 'png', 'pdf', 'docx', 'txt', 'hwp', 'hwpx']),
});
