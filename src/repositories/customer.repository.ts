import { prisma } from '../utils/prisma.util';
import { CountArgs, CustomerCreateData, CustomerCsvUploadRequest, CustomerUpdateData, FindManyArgs, QueryMode } from '../types/customer.type';

// 고객 목록 조회
export const findAll = async ({ companyId, take, skip, searchBy, keyword }: FindManyArgs) => await prisma.customer.findMany({
  where: {
    companyId,
    ...(typeof searchBy === 'string' && keyword !== undefined && {
      [searchBy]: {
        contains: keyword,
        mode: QueryMode.insensitive
      }
    }),
  },

  take,
  skip,

  include: {
    _count: {
      select: {
        contracts: true
      }
    }
  }
});

// 고객 상세 정보 조회
export const findById = async (customerId: bigint) => await prisma.customer.findUniqueOrThrow({
  where: { id: customerId },

  include: {
    _count: {
      select: {
        contracts: true
      }
    }
  }
});

// 고객 등록
export const create = async (data: CustomerCreateData) => await prisma.customer.create({data});

// 고객 수정
export const update = async (customerId: bigint, data: CustomerUpdateData) => await prisma.customer.update({
  where:{ id:customerId },
  data,
  include:{
    _count:{
      select:{
        contracts: true
      }
    }
  }
});

// 고객 삭제
export const remove = async (customerId: bigint) => await prisma.customer.delete({where: {id: customerId}});

export const count = async({ companyId, searchBy, keyword }: CountArgs) => {
  const allCustomersCount = await prisma.customer.count({
    where: {
      companyId,
      ...(typeof searchBy === 'string' && keyword !== undefined && {
        [searchBy]: {
          contains: keyword,
          mode: QueryMode.insensitive
        }
      }),
    }
  });

  return allCustomersCount;
}

// 고객 대용량 업로드
export const createMany = async (data: CustomerCsvUploadRequest[]) =>
  await prisma.customer.createMany({ data, skipDuplicates: true });