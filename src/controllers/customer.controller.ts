import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as customerService from '../services/customer.service';
import { getUser } from '../utils/user.util';
import { BadRequestError } from '../types/error.type';

// 고객 목록 조회
export const getCustomersList = async (
  req: Request<{}, {}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = getUser(req);

    // undefined, null => error
    const companyId = BigInt(user.companyId);

    const query = req.query;
    
    // 3, 7, 10, ...
    const pageSize = query.pageSize !== undefined ? Number(query.pageSize) : 10;

    // 1, 2, 3, ...
    const page = query.page !== undefined ? Number(query.page) : 1;

    const string400 = "잘못된 요청입니다.";

    if(pageSize < 1 || Object.is(pageSize, NaN)){
      throw new BadRequestError(string400); // 올바른 페이지 크기가 아닙니다.
    } else if(page < 1 || Object.is(page, NaN)){
      throw new BadRequestError(string400);
    } // 올바른 페이지 번호가 아닙니다.

    const take = pageSize;
    const skip = (page - 1) * pageSize;

    // name | email
    const searchBy = query.searchBy;
    // 문자열의 일부분. 예: 박 -> 박지호, 박기수, 김박준
    const keyword = query.keyword;
    if(searchBy && !['name', 'email'].includes(searchBy)){
      throw new BadRequestError(string400);// 검색 기준이 올바르지 않습니다.
    } else if(keyword && typeof keyword !== 'string'){
      throw new BadRequestError(string400);// 검색은 문자열만 가능합니다.
    }

    const customersListObj = await customerService.getCustomersList({companyId, take, skip, searchBy, keyword});

    res.status(200).json({
      currentPage: page,
      pageSize,
      totalPages:Math.ceil(customersListObj.totalItemCount / pageSize),
      ...customersListObj
    });
  } catch (err) {
    next(err);
  }
};

// 고객 상세 정보 조회
export const getCustomerById: RequestHandler = async (req, res, next) => {
  try {

    getUser(req);

    // undefined, null => error
    const customerId = BigInt(req.params.customerId);
    const customerObj = await customerService.getCustomerById(customerId);

    res.status(200).json(customerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 등록
export const createCustomer: RequestHandler = async (req, res, next) => {
  try {

    const user = getUser(req);

    const companyId = BigInt(user.companyId);
    const data = {companyId, ...req.body};

    const createdCustomerObj = await customerService.createCustomer(data);

    res.status(201).json(createdCustomerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 수정
export const updateCustomer: RequestHandler = async (req, res, next) => {
  try {

    const user = getUser(req);

    const companyId = BigInt(user.companyId);
    const customerId = BigInt(req.params.customerId);

    const data = {companyId, ...req.body};

    const updatedCustomerObj = await customerService.updateCustomer(customerId, data);

    res.status(200).json(updatedCustomerObj);
  } catch (err) {
    next(err);
  }
};

// 고객 삭제
export const removeCustomer: RequestHandler = async (req, res, next) => {
  try {

    getUser(req);

    const customerId = BigInt(req.params.customerId);

    await customerService.removeCustomer(customerId);

    res.status(200).json({ message: '고객 삭제 성공' });
  } catch (err) {
    next(err);
  }
};

// 고객 대용량 업로드
export const handleUploadCustomerCsvFile = async (req: Request, res: Response) => {
  const user = getUser(req);

  await customerService.uploadCustomerCsvFile(user, req.csv);

  res.status(200).json({ message: '성공적으로 등록되었습니다.' });
};
