import * as customerRepo from '../repositories/customer.repository';
import { CustomerCsvUploadRequest, CustomerCreateData } from '../types/customer.type';
import { Payload } from '../types/payload.type';
import { csvToCustomerList } from '../utils/parse.util';

// 고객 목록 조회
const getCustomersList = async (reqQuery: Record<string, string>) => {
  // 3, 7, 10, ...
  const pageSize = reqQuery.pageSize !== undefined ? Number(reqQuery.pageSize) : 10;

  // 1, 2, 3, ...
  const page = reqQuery.page !== undefined ? Number(reqQuery.page) : 1;

  // name | email
  const searchBy = reqQuery.name;

  // string
  const keyword = reqQuery.keyword;

  const take = pageSize;
  const skip = (page - 1) * pageSize;

  const ormQuery = {
    where: {
      ...(typeof searchBy === 'string' && keyword !== undefined && { [searchBy]: keyword }),
    },
    take,
    skip,
  };

  const findCustomersList = await customerRepo.findAll(ormQuery);

  return findCustomersList;
};

// 고객 상세 정보 조회
const getCustomerById = async (customerId: bigint) => {
  const findCustomer = await customerRepo.findById(customerId);

  return findCustomer;
};

// 고객 등록
const createCustomer = async (userId: bigint, data: CustomerCreateData) => {
  // user를 통해서 companyId를 알아내고 data와 합쳐서 보낸다.

  const user = await customerRepo.findUserCompanyId(userId);
  const companyId = user.companyId;

  const createdCustomer = await customerRepo.create({
    companyId,
    ...data,
  });

  return createdCustomer;
};

// 고객 수정
const updateCustomer = async (userId: bigint, customerId: bigint, data: CustomerCreateData) => {
  // 특정 고객을 user를 통해서 companyId를 알아내고 data와 합쳐서 보낸다.

  const user = await customerRepo.findUserCompanyId(userId);
  const companyId = user.companyId;
  const updatedCustomer = await customerRepo.update(customerId, {
    companyId,
    ...data,
  });

  return updatedCustomer;
};

// 고객 삭제
const removeCustomer = async (userId: bigint, customerId: bigint) => {
  // user가 진짜로 있는지 확인하는 용도
  await customerRepo.findUserCompanyId(userId);

  const deletedCustomer = await customerRepo.remove(customerId);

  return deletedCustomer;
};

const uploadCustomerCsvFile = async (user: Payload, csv: any) => {
  const companyId: bigint = BigInt(user.companyId); // getCompanyByUserId
  const customerList: CustomerCsvUploadRequest[] = csvToCustomerList(csv, companyId);

  return await customerRepo.createMany(customerList);
};

export { getCustomersList, getCustomerById, createCustomer, updateCustomer, removeCustomer, uploadCustomerCsvFile };
