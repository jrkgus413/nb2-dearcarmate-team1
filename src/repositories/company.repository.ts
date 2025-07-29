import { CompanyCreateRequest, CompanyListRequest, CompanyUpdateRequest } from '../types/company.type';
import { prisma } from '../utils/prisma.util';

export default class CompanyRepository {
  /**
   * @description 회사 등록
   */
  static async createCompany({ companyName, companyCode }: CompanyCreateRequest) {
    return await prisma.company.create({
      data: {
        name: companyName,
        companyCode
      },
      select: {
        id: true,
        name: true,
        companyCode: true,
        _count: {
          select: { users: true },
        }
      }
    });


  }
  /**
   * @description 회사 목록 조회
   */
  static async getCompanies({ whereCondition, pageSize, page }: CompanyListRequest) {
    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where: { ...whereCondition, isDeleted: false },
        take: Number(pageSize),
        skip: (Number(page) - 1) * Number(pageSize),
        select: {
          id: true,
          name: true,
          companyCode: true,
          _count: {
            select: { users: true },
          }
        },
      }),
      prisma.company.count({
        where: { ...whereCondition, isDeleted: false },
      }),
    ]);

    return {
      companies,
      totalCount,
    };
  }
  /**
   * @description 회사 ID로 조회
   */
  static async getCompanyById(companyId: bigint) {
    const company = await prisma.company.findFirst({
      where: { id: companyId, isDeleted: false },
      select: {
        id: true,
        companyCode: true
      },
    })

    return company;
  }

  /**
   * @description 회사 코드로 조회
   */
  static async getCompanyByCode(companyCode: string) {
    const company = await prisma.company.findFirst({
      where: { companyCode, isDeleted: false },
      select: {
        id: true,
        companyCode: true
      },
    })

    return company;
  }

  /**
   * @description 회사별 유저 조회
   */
  static async getUserbyCompany({ whereCondition, pageSize, page }: CompanyListRequest) {
    const [usersByCompany, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: { ...whereCondition, isDeleted: false },
        take: Number(pageSize),
        skip: (Number(page) - 1) * Number(pageSize),
        include: {
          company: { select: { name: true } }
        }
      }),
      prisma.user.count({
        where: { ...whereCondition, isDeleted: false },
      })
    ]);

    return {
      usersByCompany,
      totalCount
    };
  }

  /**
   * @description 회사 정보 수정
   */
  static async updateCompanies(companyId: bigint, { companyName, companyCode }: CompanyUpdateRequest ) {
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
        companyCode: true,
        _count: {
          select: { users: true },
        }
      }
    });
  }

  /**
   * @description 회사 삭제
   */
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