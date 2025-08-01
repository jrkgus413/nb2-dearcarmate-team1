import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';

const customerRouter = Router();

// 고객 목록 조회
customerRouter.get(
  '/', 
  allow([USER_ROLE.USER]),
  customerController.getCustomersList
);

// 고객 상세 정보 조회
customerRouter.get(
  '/:customerId',
  allow([USER_ROLE.USER]), 
  customerController.getCustomerById
);

// 고객 등록
customerRouter.post(
  '/', 
  allow([USER_ROLE.USER]),
  customerController.createCustomer
);

// 고객 수정
customerRouter.patch(
  '/:customerId', 
  allow([USER_ROLE.USER]),
  customerController.updateCustomer
);

// 고객 삭제
customerRouter.delete(
  '/:customerId', 
  allow([USER_ROLE.USER]),
  customerController.removeCustomer
);

// 고객 대용량 업로드
customerRouter.post('/upload', allow([USER_ROLE.USER]), customerController.handleUploadCustomerCsvFile);

export default customerRouter;
