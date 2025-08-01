import { prisma } from '../utils/prisma.util';
import { userRegisterRequest } from '../types/user.type';

export const UserRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: userRegisterRequest) => {
    const companyId = BigInt(1); // company랑 company code로 Company를 찾아서 id를 넣습니다.
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
          select: {
            companyCode: true,
          },
        },
      },
    });
  },
};

 