import * as customerRepo from '../repositories/customer.repository';
import { CustomerCsvUploadRequest } from '../types/customer.type';
import { csvToCustomerList } from '../utils/parse.util';

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
      ...(typeof searchBy == 'string' && keyword !== undefined && { [searchBy]: keyword }),
    },
    take,
    skip,
  };

  const customersListObj = await customerRepo.findAll(ormQuery);

  return customersListObj;
};

const getCustomerById = async (_id: bigint) => {};

const createCustomer = async (_user: Express.User, _data: CustomerCsvUploadRequest) => {
  // user를 통해서 companyId를 알아내고 data와 합쳐서 보낸다.
  // const createdCustomer = await customerRepo.create(data);
  // return createdCustomer;
};

const removeCustomer = async (_id: bigint) => {};

const uploadCustomerCsvFile = async (csv: any, _userId: bigint) => {
  const companyId: bigint = BigInt(1); // getCompanyByUserId
  const customerList: CustomerCsvUploadRequest[] = csvToCustomerList(csv, companyId);

  return await customerRepo.createMany(customerList);
};

export { getCustomersList, getCustomerById, createCustomer, removeCustomer, uploadCustomerCsvFile };
