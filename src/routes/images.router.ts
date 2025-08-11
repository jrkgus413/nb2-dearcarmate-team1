import express from 'express';
import { handleUploadImage } from '../controllers/images.controller';
import { imageUploader } from '../utils/uploader';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';

const images = express.Router();

images.post('/upload', allow([USER_ROLE.USER]), imageUploader.single('file'), handleUploadImage);

export default images;
