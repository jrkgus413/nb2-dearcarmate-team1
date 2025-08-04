import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import * as CompanyController from '../controllers/company.controller';

const router = express.Router();

// 회사 생성
router.route('/').post(allow([USER_ROLE.ADMIN]), CompanyController.createCompany);
// 회사 목록 조회
router.route('/').get(allow([USER_ROLE.ADMIN]), CompanyController.getCompanies);
// 회사별 유저 조회
router.route('/users').get(allow([USER_ROLE.ADMIN]), CompanyController.getUserbyCompany);
// 회사 정보 수정
router.route('/:companyId').patch(allow([USER_ROLE.ADMIN]), CompanyController.updateCompanies);
// 회사 정보 삭제
router.route('/:companyId').delete(allow([USER_ROLE.ADMIN]), CompanyController.deleteCompanies);

export default router;