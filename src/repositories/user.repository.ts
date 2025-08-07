import { UserUpdateRequest } from '../types/user.type';
import { prisma } from '../utils/prisma.util';

interface CreateUserParams {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  company: string;
  companyCode: string;
  employeeNumber: string;
  companyId: bigint;
}

export const findCompanyByNameAndCode = async (name: string, code: string) => {
  return prisma.company.findFirst({
    where: {
      name: name,
      companyCode: code
    }
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const findUserByEmployeeNumber = async (employeeNumber: string) => {
  return prisma.user.findUnique({
    where: { employeeNumber }
  });
};

export const createUser = async (data: CreateUserParams) => {
  return prisma.user.create({
    data,
    include: {
      affiliatedCompany: {
        select: {
          companyCode: true
        }
      }
    }
  });
}

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  getUserById: (userId: number) =>
    prisma.user.findUnique({ where: { id: userId } }),

  softDeleteUser: (userId: number) =>
    prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    }),
};

export const getMyInfo = async (userId: bigint) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      affiliatedCompany: {
        select: {
          companyCode: true
        }
      }
    }
  });
}

export const updateMyInfo = async (userId: bigint, data: UserUpdateRequest) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      employeeNumber: data.employeeNumber,
      phoneNumber: data.phoneNumber,
      password: data.password,
      image_url: data.imageUrl
    },
    include: {
      affiliatedCompany: {
        select: {
          companyCode: true
        }
      }
    }
  });
}

