import { RequestHandler } from 'express';
import { uploadImage } from '../services/images.service';
import { BadRequestError } from '../types/error.type';

export const handleUploadImage: RequestHandler = async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new BadRequestError('파일이 없습니다.');
  }

  const body = await uploadImage(file);

  res.status(200).json(body);
};
