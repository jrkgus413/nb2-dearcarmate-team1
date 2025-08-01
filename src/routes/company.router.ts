import express from 'express';
import * as CompanyController from '../controllers/company.controller';

const router = express.Router();

// 회사 생성
router.route('/').post(CompanyController.createCompany);
// 회사 목록 조회
router.route('/').get(CompanyController.getCompanies);
// 회사별 유저 조회
router.route('/users').get(CompanyController.getUserbyCompany);
// 회사 정보 수정
router.route('/:companyId').patch(CompanyController.updateCompanies);
// 회사 정보 삭제
router.route('/:companyId').delete(CompanyController.deleteCompanies);

export default router;