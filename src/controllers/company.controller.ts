
import { Request, Response } from 'express';
import  * as CompanyService from '../services/company.service';
import { CompanyCreateRequest, CompanyGetQuery, CompanyUpdateRequest } from '../types/company.type';

/**
 * @description 회사 등록 
 * @param {string} companyName - 회사명
 * @param {string} companyCode - 회사 코드
 */
export const createCompany = async (req: Request, res: Response) => {
  const { companyName, companyCode }: CompanyCreateRequest = req.body;

  if (!companyName || !companyCode) {
    return res.status(400).json({ error: '회사명과 회사코드는 필수입니다.' });
  }

  if (typeof companyName !== 'string' || typeof companyCode !== 'string') {
    return res.status(400).json({ error: '회사명과 회사코드는 문자열이어야 합니다.' });
  }

  if (companyName.trim().length === 0 || companyCode.trim().length === 0) {
    return res.status(400).json({ error: '회사명과 회사코드는 빈 문자열일 수 없습니다.' });
  }

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
export const getCompanies = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, searchBy = 'companyName', keyword }: CompanyGetQuery = req.query;

  if (page < 1 || pageSize < 1) {
    return res.status(400).json({ error: '페이지 번호와 페이지 크기는 1 이상이어야 합니다.' });
  }
  if (searchBy && !['companyName', 'companyCode'].includes(searchBy)) {
    return res.status(400).json({ error: '유효하지 않은 검색 기준입니다.' });
  }
  if (keyword && typeof keyword !== 'string') {
    return res.status(400).json({ error: '검색어는 문자열이어야 합니다.' });
  }

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
export const getUserbyCompany = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, searchBy = 'companyName', keyword }: CompanyGetQuery = req.query;
  const whereCondition: object = keyword ? { [searchBy]: { contains: keyword } } : {};

  if (page < 1 || pageSize < 1) {
    return res.status(400).json({ error: '페이지 번호와 페이지 크기는 1 이상이어야 합니다.' });
  }
  if (searchBy && !['companyName', 'companyCode'].includes(searchBy)) {
    return res.status(400).json({ error: '유효하지 않은 검색 기준입니다.' });
  }
  if (keyword && typeof keyword !== 'string') {
    return res.status(400).json({ error: '검색어는 문자열이어야 합니다.' });
  }

  const response = await CompanyService.getUserbyCompany({ whereCondition, pageSize, page });
  res.status(200).json(response);
}

/**
 * @description 회사 정보 수정
 * @param {number} companyId - 회사 ID
 * @param {string} companyName - 회사명
 * @param {string} companyCode - 회사 코드
 */
export const updateCompanies = async (req: Request, res: Response) => {
  const companyIdParam = req.params.companyId;

  if (!companyIdParam || isNaN(Number(companyIdParam))) {
    return res.status(400).json({ error: '유효한 회사 ID가 필요합니다.' });
  }

  const companyId = BigInt(companyIdParam);
  const { companyName, companyCode }: CompanyUpdateRequest = req.body;

  if (!companyName && !companyCode) {
    return res.status(400).json({ error: '수정할 데이터가 필요합니다.' });
  }

  if (companyName && (typeof companyName !== 'string' || companyName.trim().length === 0)) {
    return res.status(400).json({ error: '유효한 회사명이 필요합니다.' });
  }

  if (companyCode && (typeof companyCode !== 'string' || companyCode.trim().length === 0)) {
    return res.status(400).json({ error: '유효한 회사코드가 필요합니다.' });
  }

  const response = await CompanyService.updateCompanies(companyId, { companyName, companyCode });

  res.status(200).json(response);
}

/**
 * @description 회사 정보 삭제
 * @param {number} companyId - 회사 ID
 */
export const deleteCompanies = async (req: Request, res: Response) => {
  const companyIdParam = req.params.companyId;

  if (!companyIdParam || isNaN(Number(companyIdParam))) {
    return res.status(400).json({ error: '유효한 회사 ID가 필요합니다.' });
  }

  const companyId = BigInt(companyIdParam);

  await CompanyService.deleteCompanies(companyId);

  res.status(204).json({ message: '회사가 삭제되었습니다.' });
}

