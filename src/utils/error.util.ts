import { MulterError } from 'multer';
import { HttpError } from '../types/error.type';

export const isErrorInstanceOfHttp = (error: unknown): error is HttpError => error instanceof HttpError;
export const isErrorInstanceOfNode = (error: unknown): error is Error => error instanceof Error;
export const isErrorInstanceOfMulter = (error: unknown): error is MulterError => error instanceof MulterError;
