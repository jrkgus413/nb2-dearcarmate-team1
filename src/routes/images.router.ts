import express from 'express';
import { handleUploadImage } from '../controllers/images.controller';
import { imageUploader } from '../utils/uploader';

const images = express.Router();

images.post('/upload', imageUploader.single('image'), handleUploadImage);

export default images;
