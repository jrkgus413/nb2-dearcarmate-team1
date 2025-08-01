import { RequestHandler } from 'express';
import { uploadImage } from '../services/images.service';
import { getFile } from '../utils/file.util';

export const handleUploadImage: RequestHandler = async (req, res) => {
  const file = getFile(req);

  const body = await uploadImage(file);

  res.status(200).json(body);
};
