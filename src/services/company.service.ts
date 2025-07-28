import CompanyRepository from "../repositories/company.repository";
import { NotFoundError } from "../types/error.type";
import { CompanyCreateRequest, CompanyListRequest, CompanyUpdateRequest } from "../types/company.type";


export default class CompanyService {
  static async createCompany({ companyName, companyCode }: CompanyCreateRequest) {
    return await CompanyRepository.createCompany({ companyName, companyCode });
  }

  static async getCompanies({ whereCondition, pageSize, page }: CompanyListRequest) {
    const { companies, totalCount } = await CompanyRepository.getCompanies({ whereCondition, pageSize, page });

    const formattedCompanies = companies.map(({ users, ...company }) => ({
      ...company,
      usersCount: users.length
    }));

    return {
      page: Number(page),
      pageSize: Number(pageSize),
      totalCount,
      data:formattedCompanies
    }
  }

  static async getUserbyCompany({ whereCondition, pageSize, page }: CompanyListRequest) {
    const { usersByCompany, totalCount } = await CompanyRepository.getUserbyCompany({ whereCondition, pageSize, page });

    const formattedUsers = usersByCompany.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        employeeNumber: user.employeeNumber,
        phoneNumber: user.phoneNumber,
        company: user.company
      }
    });

    return {
      page: Number(page),
      pageSize: Number(pageSize),
      totalCount,
      data: formattedUsers
    }
  }

  static async updateCompanies({ companyId, companyName, companyCode }: CompanyUpdateRequest) {
    const companies = await CompanyRepository.updateCompanies({ companyId, companyName, companyCode });
    if (!companies) throw new NotFoundError(`수정할 회사가 존재하지 않습니다.`);
    return companies;
  }

  static async deleteCompanies(companyId: bigint) {
    const companies = await CompanyRepository.deleteCompanies(companyId);
    if (!companies) throw new NotFoundError(`삭제할 회사가 존재하지 않습니다.`);
    return companies;
  }
}