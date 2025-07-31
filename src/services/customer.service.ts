import { Prisma } from '@prisma/client';
import * as customerRepo from '../repositories/customer.repository';
import { CustomerCsvUploadRequest, CustomerCreateData } from '../types/customer.type';
import { Payload } from '../types/payload.type';
import { csvToCustomerList } from '../utils/parse.util';
import { convertBigIntToString } from '../utils/convert.util';

// 고객 목록 조회
const getCustomersList = async (
  companyId: bigint,
  reqQuery: Record<string, string>
) => {
  // 3, 7, 10, ...
  const pageSize = reqQuery.pageSize !== undefined ? Number(reqQuery.pageSize) : 10;

  // 1, 2, 3, ...
  const page = reqQuery.page !== undefined ? Number(reqQuery.page) : 1;

  // name | email
  const searchBy = reqQuery.name;

  // 문자열의 일부분. 예: 박 -> 박지호, 박기수, 김박준
  const keyword = reqQuery.keyword;

  const take = pageSize;
  const skip = (page - 1) * pageSize;

  const ormQuery = {
    where: {
      companyId,
      ...(typeof searchBy === 'string' && keyword !== undefined && { 
        [searchBy]: {
          contains: keyword,
          mode: Prisma.QueryMode.insensitive
        } 
      }),
    },

    take,
    skip,
  };

  const findCustomersList = await customerRepo.findAll(ormQuery);

  // const resultJson = {
  //   data:findCustomersList
  // }

  return convertBigIntToString(findCustomersList);
};

// 고객 상세 정보 조회
const getCustomerById = async (customerId: bigint) => {
  const findCustomer = await customerRepo.findById(customerId);

  return convertBigIntToString(findCustomer);
};

// 고객 등록
const createCustomer = async (
  data: CustomerCreateData
) => {

  const createdCustomer = await customerRepo.create(data);

  return convertBigIntToString(createdCustomer);
};

// 고객 수정
const updateCustomer = async (
  customerId: bigint, 
  data: CustomerCreateData
) => {

  const updatedCustomer = await customerRepo.update(customerId, data);

  return convertBigIntToString(updatedCustomer);
};

// 고객 삭제
const removeCustomer = async (customerId: bigint) => {

  const deletedCustomer = await customerRepo.remove(customerId);

  return deletedCustomer;
};

// 고객 대용량 업로드
const uploadCustomerCsvFile = async (user: Payload, csv: any) => {
  const companyId: bigint = BigInt(user.companyId);
  const customerListRequest: CustomerCsvUploadRequest[] = csvToCustomerList(csv, companyId);

  return await customerRepo.createMany(customerListRequest);
};

export { getCustomersList, getCustomerById, createCustomer, updateCustomer, removeCustomer, uploadCustomerCsvFile };
