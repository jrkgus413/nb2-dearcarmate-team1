import { CompanyCreateRequest, CompanyListRequest, CompanyUpdateRequest } from '../types/company.type';
import { prisma } from '../utils/db.util';

export default class CompanyRepository {
  static async createCompany({ companyName, companyCode }: CompanyCreateRequest) {
    return await prisma.company.create({
      data: {
        name: companyName,
        companyCode
      }
    });
  }

  static async getCompanies({ whereCondition, pageSize, page }: CompanyListRequest) {
    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where: whereCondition,
        take: Number(pageSize),
        skip: (Number(page) - 1) * Number(pageSize),
        select: {
          id: true,
          name: true,
          companyCode: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.company.count({
        where: whereCondition,
      }),
    ]);

    return {
      companies,
      totalCount,
    };
  }

  static async getUserbyCompany({ whereCondition, pageSize, page }: CompanyListRequest) {
    const [usersByCompany, totalCount] = await Promise.all([
      await prisma.user.findMany({
        where: whereCondition,
        take: Number(pageSize),
        skip: (Number(page) - 1) * Number(pageSize),
        include: {
          company: { select: { name: true } }
        }
      }),
      await prisma.user.count({
        where: whereCondition,
      })
    ]);

    return {
      usersByCompany,
      totalCount
    };
  }

  static async updateCompanies({ companyId, companyName, companyCode }: CompanyUpdateRequest) {
    return await prisma.company.update({
      data: {
        name: companyName,
        companyCode,
        updatedAt: new Date()
      },
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        companyCode: true
      }
    });
  }

  static async deleteCompanies(companyId: bigint) {
    return await prisma.company.update({
      data: {
        deletedAt: new Date(),
        isDeleted: true
      },
      where: { id: companyId },
      select: {
        id: true
      }
    })
  }
}