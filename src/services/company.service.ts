import { ConflictError, NotFoundError } from "../types/error.type";
import { CompanyCreateRequest, CompanyListRequest, CompanyUpdateRequest } from "../types/company.type";
import { convertBigIntToString } from "../utils/convert.util";
import * as CompanyRepository from "../repositories/company.repository";

/**
  * @description 회사 등록
  */
export const createCompany = async ({ companyName, companyCode }: CompanyCreateRequest) => {
  const existingCompany = await CompanyRepository.getCompanyByCode(companyCode);
  console.log(existingCompany);
  if (existingCompany) throw new ConflictError(`동일한 회사코드가 이미 존재합니다.`);
  

  const newCompany = await CompanyRepository.createCompany({ companyName, companyCode });
  const { _count, ...companyWithoutUsers } = newCompany;
  const formattedCompany = {
    ...companyWithoutUsers,
    usersCount: _count.users
  };

  return convertBigIntToString(formattedCompany);
}


/**
 * @description 회사 목록 조회
 */
export const getCompanies = async ({ whereCondition, pageSize, page }: CompanyListRequest) => {
  const { companies, totalCount } = await CompanyRepository.getCompanies({ whereCondition, pageSize, page });

  const formattedCompanies = companies.map(({ _count, ...company }) => ({
    ...company,
    usersCount: _count.users
  }));

  return {
    page: Number(page),
    pageSize: Number(pageSize),
    totalCount,
    data: convertBigIntToString(formattedCompanies)
  }
}

/***
* @description 회사별 유저 조회
*/
export const getUserbyCompany = async ({ whereCondition, pageSize, page }: CompanyListRequest) => {
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
    data: convertBigIntToString(formattedUsers)
  }
}

/**
 * @description 회사 정보 수정
 */
export const updateCompanies = async (companyId: bigint, { companyName, companyCode }: CompanyUpdateRequest) => {
  const getCompany = await CompanyRepository.getCompanyById(companyId);
  if (!getCompany) throw new NotFoundError(`회사가 존재하지 않습니다.`);

  // 회사코드가 변경되는 경우에만 중복 체크
  if (companyCode && getCompany.companyCode !== companyCode) {
    const existingCompany = await CompanyRepository.getCompanyByCode(companyCode, companyId);
    if (existingCompany) throw new ConflictError(`동일한 회사코드가 이미 존재합니다.`);
  }

  const companies = await CompanyRepository.updateCompanies(companyId, { companyName, companyCode });
  const { _count, ...companyWithoutUsers } = companies;
  const formattedCompany = {
    ...companyWithoutUsers,
    usersCount: _count.users
  };

  return convertBigIntToString(formattedCompany);
}

/**
 * @description 회사 삭제
 */
export const deleteCompanies = async (companyId: bigint) => {
  const getCompany = await CompanyRepository.getCompanyById(companyId);
  if (!getCompany) throw new NotFoundError(`회사가 존재하지 않습니다.`);

  const companies = await CompanyRepository.deleteCompanies(companyId);
  return convertBigIntToString(companies);
}
