
import { Request, Response } from 'express';
import CompanyService from '../services/company.service';
import { CompanyCreateRequest, CompanyGetQuery, CompanyUpdateRequest } from '../types/company.type';

export default class CompanyController {
  /**
   * @description 회사 등록 
   * @param {string} companyName
   * @param {string} companyCode
   */
  static async createCompany(req: Request, res: Response) {
    const { companyName, companyCode }: CompanyCreateRequest = req.body;

    const response = await CompanyService.createCompany({ companyName, companyCode });

    res.status(201).json(response);
  }

  /**
   * @description 회사 목록 조회 
   * @param {number} page - 현재 페이지 번호
   * @param {number} pageSize - 페이지당 아이템 수
   * @param {string} searchBy - 검색 기준
   * @param {string} keyword - 검색어
   */
  static async getCompanies(req: Request, res: Response) {
    const { page = 1, pageSize = 10, searchBy = 'companyName', keyword }: CompanyGetQuery = req.query;
    const whereCondition: object = keyword ? { [searchBy]: { contains: keyword } } : {};

    const response = await CompanyService.getCompanies({ page, pageSize, whereCondition });

    res.status(200).json(response);
  }

  /***
   * @description 회사별 유저 조회
   * @param {number} page - 현재 페이지 번호
   * @param {number} pageSize - 페이지당 아이템 수
   * @param {string} searchBy - 검색 기준
   * @param {string} keyword - 검색어
   */
  static async getUserbyCompany(req: Request, res: Response) {
    const { page = 1, pageSize = 10, searchBy = 'companyName', keyword }: CompanyGetQuery = req.query;
    const whereCondition: object = keyword ? { [searchBy]: { contains: keyword } } : {};

    const response = await CompanyService.getUserbyCompany({ whereCondition, pageSize, page });
    res.status(200).json(response);
  }

  /**
   * @description 회사 정보 수정
   * @param {number} companyId - 회사 ID
   * @param {string} companyName
   * @param {string} companyCode
   */
  static async updateCompanies(req: Request, res: Response) {
    const companyId = BigInt(req.params.companyId);
    const { companyName, companyCode }: CompanyUpdateRequest = req.body;

    const response = await CompanyService.updateCompanies({ companyId, companyName, companyCode });

    res.status(200).json(response);
  }

  /**
   * @description 회사 정보 삭제
   * @param {number} companyId - 회사 ID
   */
  static async deleteCompanies(req: Request, res: Response) {
    const companyId = BigInt(req.params.companyId);

    await CompanyService.deleteCompanies(companyId);

    res.status(204).json({ msg: "회사 정보가 정상적으로 삭제 되었습니다." });
  }
}
