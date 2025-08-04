import { Prisma } from '@prisma/client';
import * as customerRepo from '../repositories/customer.repository';
import { CustomerCsvUploadRequest, CustomerCreateData, FindManyArgs } from '../types/customer.type';
import { Payload } from '../types/payload.type';
import { csvToCustomerList } from '../utils/parse.util';
import { convertBigIntToString } from '../utils/convert.util';

// 고객 목록 조회
const getCustomersList = async (
  {companyId, take, skip, searchBy, keyword}: FindManyArgs
) => {

  const findCustomersList = await customerRepo.findAll({companyId, take, skip, searchBy, keyword});

  return convertBigIntToString(findCustomersList.map((customer) => ({...customer, contractCount: customer._count.contracts, _count: undefined })));
};

// 고객 상세 정보 조회
const getCustomerById = async (customerId: bigint) => {

  const ormQuery: Prisma.CustomerFindUniqueOrThrowArgs = {
    where: {id:customerId},

    include:{
      _count:{
        select:{
          contracts: true
        }
      }
    }
  }

  const findCustomer = await customerRepo.findById(ormQuery);

  return findCustomer;
};

// 고객 등록
const createCustomer = async (
  data: CustomerCreateData
) => {

  const ormQuery:Prisma.CustomerCreateArgs = {
    data,
    include: {
      _count:{
        select:{
          contracts: true
        }
      }
    }
  };

  const createdCustomer = await customerRepo.create(ormQuery);

  return createdCustomer;
};

// 고객 수정
const updateCustomer = async (customerId: bigint, data: CustomerCreateData) => {

  const ormQuery: Prisma.CustomerUpdateArgs = {
    where:{ id:customerId },
    data,
    include:{
      _count:{
        select:{
          contracts: true
        }
      }
    }
  };

  const updatedCustomer = await customerRepo.update(ormQuery);

  return updatedCustomer;
};

// 고객 삭제
const removeCustomer = async (customerId: bigint) => {

  const ormQuery: Prisma.CustomerDeleteArgs = {
    where: {id: customerId}
  };

  const deletedCustomer = await customerRepo.remove(ormQuery);

  return deletedCustomer;
};

// 고객 대용량 업로드
const uploadCustomerCsvFile = async (user: Payload, csv: any) => {
  const companyId: bigint = BigInt(user.companyId);
  const customerListRequest: CustomerCsvUploadRequest[] = csvToCustomerList(csv, companyId);

  return await customerRepo.createMany(customerListRequest);
};

export { getCustomersList, getCustomerById, createCustomer, updateCustomer, removeCustomer, uploadCustomerCsvFile };
