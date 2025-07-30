import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as customerService from '../services/customer.service';
import { UnauthorizedError } from '../types/error.type';
// import { BadRequestError, NotFoundError } from '../types/error.type';

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

const getCustomerById: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

const createCustomer: RequestHandler = async (req, res, next) => {
  try {
    if (req.user == null) {
      throw new UnauthorizedError('권한이 없습니다.');
    }

    const user = req.user;
    const data = req.body;
    const createdCustomerObj = await customerService.createCustomer(user, data);

    res.status(201).json(createdCustomerObj);
  } catch (err) {
    next(err);
  }
};

const removeCustomer: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

const handleUploadCustomerCsvFile = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError();
  }

  await customerService.uploadCustomerCsvFile(req.csv, BigInt(user.id));

  res.status(200).json({ message: '성공적으로 등록되었습니다.' });
};

export { getCustomersList, getCustomerById, createCustomer, removeCustomer, handleUploadCustomerCsvFile };
