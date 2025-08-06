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

  // 여기 추가!
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
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      company: true,
      companyCode: true,
      employeeNumber: true
    }
  });
}
