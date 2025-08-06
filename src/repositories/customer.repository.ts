import { prisma } from '../utils/prisma.util';
import { CustomerCreateData, CustomerCsvUploadRequest, CustomerUpdateData, FindManyArgs, QueryMode } from '../types/customer.type';

const globalInclude = {
  _count: {
    select: {
      contracts: true
    }
  }
};

// 고객 목록 조회
export const findAllWithCount = async ({ companyId, take, skip, searchBy, keyword }: FindManyArgs) => {
  const where = {
    companyId,
    ...(typeof searchBy === 'string' && keyword !== undefined && {
      [searchBy]: {
        contains: keyword,
        mode: QueryMode.insensitive
      }
    }),
    isDeleted:false
  };

  const [findCustomersList, companyCustomerCount] = await Promise.all([
    prisma.customer.findMany({
      where,

      take,
      skip,

      include: globalInclude
    }),
    prisma.customer.count({ where })
  ]);

  return { findCustomersList, companyCustomerCount };
};

// 고객 상세 정보 조회
export const findById = async (customerId: bigint) => await prisma.customer.findUnique({
  where: { 
    id: customerId,
    isDeleted:false
  },

  include: globalInclude
});

// 삭제된 고객 상세 조회
export const findDeletedFirst = async (phoneNumber: string) => await prisma.customer.findFirst({
  where: {
    phoneNumber,
    isDeleted:true
  }
});

// 고객 등록
export const create = async (data: CustomerCreateData) => await prisma.customer.create({ data, include: globalInclude });

// 고객 수정
export const update = async (customerId: bigint, data: CustomerUpdateData) => await prisma.customer.update({
  where: { id: customerId },
  data,
  include: globalInclude
});

// 고객 삭제
export const remove = async (customerId: bigint) =>
  await prisma.customer.update({
    where: {id: customerId},
    data:{
      isDeleted: true,
      deletedAt: new Date()
    }
  }
);
//await prisma.customer.delete({ where: { id: customerId } });

// 고객 대용량 업로드
export const createMany = async (data: CustomerCsvUploadRequest[]) =>
  await prisma.customer.createMany({ data, skipDuplicates: true });