import { prisma } from '../utils/prisma.util';
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
};