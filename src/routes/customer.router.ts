import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';

const customerRouter = Router();

// 고객 목록 조회
customerRouter.get('/', customerController.getCustomersList);

// 고객 상세 정보 조회
customerRouter.get('/:customerId', customerController.getCustomerById);

// 고객 등록
customerRouter.post('/', customerController.createCustomer);

// 고객 수정
customerRouter.patch('/:customerId', customerController.updateCustomer);

// 고객 삭제
customerRouter.delete('/:customerId', customerController.removeCustomer);

customerRouter.post('/upload', customerController.handleUploadCustomerCsvFile);

export default customerRouter;
