import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as customerService from '../services/customer.service';
import { UnauthorizedError } from '../types/error.type';
import { getUser } from '../utils/user.util';
// import { BadRequestError, NotFoundError } from '../types/error.type';

//
const getCustomersList = async (
  req: Request<{}, {}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const customersListObj = await customerService.getCustomersList(req.query);

    res.status(200).json(customersListObj);
  } catch (err) {
    next(err);
  }
};

// 고객 상세 정보 조회
const getCustomerById: RequestHandler = async (req, res, next) => {
  try {
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
    if (req.user == null) {
      throw new UnauthorizedError('권한이 없습니다.');
    }

    const userId = BigInt(req.user.id);
    const data = req.body;
    const createdCustomerObj = await customerService.createCustomer(userId, data);

    res.status(201).json(createdCustomerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 수정
const updateCustomer: RequestHandler = async (req, res, next) => {
  try {
    if (req.user == null) {
      throw new UnauthorizedError('권한이 없습니다.');
    }

    const customerId = BigInt(req.params.customerId);
    const userId = BigInt(req.user.id);
    const data = req.body;

    const updatedCustomerObj = await customerService.updateCustomer(userId, customerId, data);

    res.status(200).json(updatedCustomerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 삭제
const removeCustomer: RequestHandler = async (req, res, next) => {
  try {
    if (req.user == null) {
      throw new UnauthorizedError('권한이 없습니다.');
    }

    const customerId = BigInt(req.params.customerId);
    const userId = BigInt(req.user.id);

    const deletedCustomerObj = await customerService.removeCustomer(userId, customerId);

    console.log(deletedCustomerObj);

    res.status(200).json({ message: '고객 삭제 성공' });
  } catch (err) {
    next(err);
  }
};

const handleUploadCustomerCsvFile = async (req: Request, res: Response) => {
  const user = getUser(req);

  await customerService.uploadCustomerCsvFile(user, req.csv);

  res.status(200).json({ message: '성공적으로 등록되었습니다.' });
};

export {
  getCustomersList,
  getCustomerById,
  createCustomer,
  updateCustomer,
  removeCustomer,
  handleUploadCustomerCsvFile,
};
