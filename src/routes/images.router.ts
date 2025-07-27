import express from 'express';
import multer from 'multer';
import { handleUploadImage } from '../controllers/images.controller';

const images = express.Router();
const imageUploader = multer({ storage: multer.memoryStorage() });

images.post('/upload', imageUploader.single('image'), handleUploadImage);

export default images;
