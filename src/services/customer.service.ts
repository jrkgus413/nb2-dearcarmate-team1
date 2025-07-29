import * as customerRepo from '../repositories/customer.repository';

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

// const getCustomerById = async (id: bigint) => {

// };

// const createCustomer = async (data: any) => {
    
// };

// const removeCustomer = async (id: bigint) => {

// };

export {
    getCustomersList,
    // getCustomerById,
    // createCustomer,
    // removeCustomer
};