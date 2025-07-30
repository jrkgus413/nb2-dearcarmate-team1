import * as customerRepo from '../repositories/customer.repository';
import { CustomerCsvUploadRequest } from '../types/customer.type';

// 고객 목록 조회
const getCustomersList = async (
    reqQuery: Record<string, string>
) => {
    // 3, 7, 10, ...
    const pageSize = reqQuery.pageSize !== undefined ? Number(reqQuery.pageSize) : 10;
    
    // 1, 2, 3, ...
    const page = reqQuery.page !== undefined ? Number(reqQuery.page) : 1
    
    // name | email
    const searchBy = reqQuery.name;

    // string
    const keyword = reqQuery.keyword;

    const take = pageSize;
    const skip = (page - 1) * pageSize;

    const ormQuery = {
        where: {
            ...(typeof searchBy == 'string' && keyword !== undefined && {[searchBy]: keyword})
        },
        take,
        skip
    };

    const customersListObj = await customerRepo.findAll(ormQuery);

    return customersListObj;
};

// 고객 상세 정보 조회
const getCustomerById = async (customerId: bigint) => {
    const customerObj = await customerRepo.findById(customerId);

    return customerObj;
};

// 고객 등록
const createCustomer = async (_userId: bigint, _data: CustomerCsvUploadRequest) => {
    // user를 통해서 companyId를 알아내고 data와 합쳐서 보낸다.
    // const createdCustomer = await customerRepo.create(data);

    // return createdCustomer;
};

// 고객 수정
const updateCustomer = async (_userId: bigint, _customerId: bigint, _data: CustomerCsvUploadRequest) => {
    // 특정 고객을 user를 통해서 companyId를 알아내고 data와 합쳐서 보낸다.
    // const updatedCustomer = await customerRepo.update(customerId, data);
    return updateCustomer;
};

// 고객 삭제
const removeCustomer = async (_customerId: bigint) => {
    const deletedCustomer = await customerRepo.remove(_customerId);

    return deletedCustomer;
};

export {
    getCustomersList,
    getCustomerById,
    createCustomer,
    updateCustomer,
    removeCustomer
};