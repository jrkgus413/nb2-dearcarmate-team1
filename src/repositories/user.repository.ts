import { prisma } from '../utils/prisma.util';
export const findCompanyByNameAndCode = async (name: string, code: string) => {
  return prisma.company.findFirst({
    where: {
      name: name,
      companyCode: code
    }
  });
};

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  getUserById: (userId: number) =>
    prisma.user.findUnique({ where: { id: userId } }),

  create: (data: userRegisterRequest) => {
    const companyId = BigInt(1); // 예시용
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        employeeNumber: data.employeeNumber,
        phoneNumber: data.phoneNumber,
        password: data.password,
        companyCode: data.companyCode,
        company: data.company,
        companyId,
      },
      include: {
        affiliatedCompany: {
          select: { companyCode: true },
        },
      },
    });
  },

  // 여기 추가!
  softDeleteUser: async (userId: number) =>
    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
      select: { id: true },
    }),
};

