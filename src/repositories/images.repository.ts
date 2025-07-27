import { FileCreateRequest } from '../types/file.type';
import { prisma } from '../utils/prisma.util';

export const createUserImage = async (fileCreateRequest: FileCreateRequest) => {
  const createdImage = await prisma.file.create({ data: fileCreateRequest });

  return createdImage;
};
