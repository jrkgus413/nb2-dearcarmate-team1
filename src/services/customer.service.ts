import * as customerRepo from '../repositories/customer.repository';
import { CustomerCsvUploadRequest, CustomerCreateData, FindManyArgs, CustomerUpdateData } from '../types/customer.type';
import { Payload } from '../types/payload.type';
import { csvToCustomerList } from '../utils/parse.util';

// 고객 목록 조회
export const getCustomersList = async (
  {companyId, take, skip, searchBy, keyword}: FindManyArgs
) => {

  const { findCustomersList, companyCustomerCount } = await customerRepo.findAllWithCount({companyId, take, skip, searchBy, keyword});

  return {
    totalItemCount:companyCustomerCount,
    data: findCustomersList.map((customer) => ({...customer, contractCount: customer._count.contracts, _count: undefined }))
  };
};

// 고객 상세 정보 조회
export const getCustomerById = async (customerId: bigint) => {

  const findCustomer = await customerRepo.findById(customerId);

  if(!findCustomer) return null;

  return {
    ...findCustomer,
    contractCount: findCustomer?._count.contracts,
    _count: undefined
  };
};

// 고객 등록
export const createCustomer = async (data: CustomerCreateData) => {

  const deletedCustomerFound = await customerRepo.findDeletedFirst(data.phoneNumber);

  let createdCustomer;

  if( deletedCustomerFound ){
    createdCustomer = await customerRepo.update(deletedCustomerFound.id, {
      ...data,
      isDeleted: false,
      deletedAt: null
    });
  } else {
    createdCustomer = await customerRepo.create(data);
  }

  return {
    ...createdCustomer,
    contractCount: createdCustomer._count.contracts,
    _count: undefined
  };
};

// 고객 수정
export const updateCustomer = async (customerId: bigint, data: CustomerUpdateData) => {

  const updatedCustomer = await customerRepo.update(customerId, data);

  return {
    ...updatedCustomer,
    contractCount: updatedCustomer._count.contracts,
    _count: undefined
  };
};

// 고객 삭제
export const removeCustomer = async (customerId: bigint) => {

  const deletedCustomer = await customerRepo.remove(customerId);

  return deletedCustomer;
};

// 고객 대용량 업로드
export const uploadCustomerCsvFile = async (user: Payload, csv: any) => {
  const companyId: bigint = BigInt(user.companyId);
  const customerListRequest: CustomerCsvUploadRequest[] = csvToCustomerList(csv, companyId);

  return await customerRepo.createMany(customerListRequest);
};
