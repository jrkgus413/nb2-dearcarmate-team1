import { Request } from 'express';
import { UnauthorizedError } from '../types/error.type';

export const getFile = (req: Request): Express.Multer.File => {
  const file = req.file;
  if (file !== undefined) {
    return file;
  }
  throw new UnauthorizedError();
};
