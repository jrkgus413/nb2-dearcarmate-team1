import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as customerService from '../services/customer.service';
import { getUser } from '../utils/user.util';

// 고객 목록 조회
const getCustomersList = async (
  req: Request<{}, {}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = getUser(req);

    const companyId = BigInt(user.companyId);

    const customersListObj = await customerService.getCustomersList(companyId, req.query);

    res.status(200).json(customersListObj);
  } catch (err) {
    next(err);
  }
};

// 고객 상세 정보 조회
const getCustomerById: RequestHandler = async (req, res, next) => {
  try {

    getUser(req);

    const customerId = BigInt(req.params.customerId);
    const customerObj = await customerService.getCustomerById(customerId);

    res.status(200).json(customerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 등록
const createCustomer: RequestHandler = async (req, res, next) => {
  try {

    const user = getUser(req);

    const companyId = BigInt(user.companyId);
    const data = req.body;
    
    const createdCustomerObj = await customerService.createCustomer({companyId, ...data});

    res.status(201).json(createdCustomerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 수정
const updateCustomer: RequestHandler = async (req, res, next) => {
  try {

    const user = getUser(req);

    const companyId = BigInt(user.companyId);
    const customerId = BigInt(req.params.customerId);
    
    const data = req.body;

    const updatedCustomerObj = await customerService.updateCustomer(customerId, {companyId, ...data});

    res.status(200).json(updatedCustomerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 삭제
const removeCustomer: RequestHandler = async (req, res, next) => {
  try {

    getUser(req);

    const customerId = BigInt(req.params.customerId);

    const deletedCustomerObj = await customerService.removeCustomer(customerId);

    console.log(deletedCustomerObj);

    res.status(200).json({ message: '고객 삭제 성공' });
  } catch (err) {
    next(err);
  }
};

// 고객 대용량 업로드
const handleUploadCustomerCsvFile = async (req: Request, res: Response) => {
  const user = getUser(req);

  await customerService.uploadCustomerCsvFile(user, req.csv);

  res.status(200).json({ message: '성공적으로 등록되었습니다.' });
};

export { getCustomersList, getCustomerById, createCustomer, updateCustomer, removeCustomer, handleUploadCustomerCsvFile };
