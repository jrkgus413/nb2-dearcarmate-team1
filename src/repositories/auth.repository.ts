import { prisma } from '../utils/prisma.util';

export const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      affiliatedCompany: true,
    },
  });
