import { createUserImage } from '../repositories/images.repository';
import { FileCreateRequest } from '../types/file.type';
import { bucket } from '../utils/firebase';

export const uploadImage = async (file: Express.Multer.File) => {
  return new Promise(async (resolve, reject) => {
    const fileName = `images/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('[images] blob stream error: ', error);
      reject(error);
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const name = file.originalname;
        const ext = file.originalname.split('.').pop() || '';
        const size = BigInt(file.size);
        const fileCreateRequest: FileCreateRequest = {
          url,
          name,
          ext,
          size,
        };

        const createdImage = await createUserImage(fileCreateRequest);
        resolve({ imageUrl: createdImage.url });
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};
