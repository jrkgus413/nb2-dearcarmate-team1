import { Prisma as P } from "@prisma/client";
import { prisma } from '../utils/prisma.util';
import { CustomerCreateData, CustomerCsvUploadRequest, CustomerUpdateData } from '../types/customer.type';

// 고객 목록 조회
const findAll = async (
    query: P.CustomerFindManyArgs
) => await prisma.customer.findMany(query);

// 고객 상세 정보 조회
const findById = async (customerId: bigint) => await prisma.customer.findUniqueOrThrow({ where: { id: customerId } });

// 고객 등록
const create = async (data: CustomerCreateData) => await prisma.customer.create({ data });

// 고객 수정
const update = async (
    customerId: bigint,
    data: CustomerUpdateData
) => await prisma.customer.update({
    where: { id: customerId },
    data
});

// 고객 삭제
const remove = async (customerId: bigint) => await prisma.customer.delete({ where: { id: customerId } });

// 고객 대용량 업로드
const createMany = async (data: CustomerCsvUploadRequest[]) =>
    await prisma.customer.createMany({ data, skipDuplicates: true });

export { findAll, findById, create, update, remove, createMany };