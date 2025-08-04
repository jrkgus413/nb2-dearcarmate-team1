import { Prisma } from "@prisma/client";
import { prisma } from '../utils/prisma.util';
import { CustomerCsvUploadRequest, FindManyArgs } from '../types/customer.type';

// 고객 목록 조회
const findAll = async ({ companyId, take, skip, searchBy, keyword }: FindManyArgs) => await prisma.customer.findMany({
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

    include: {
        _count: {
            select: {
                contracts: true
            }
        }
    }
});

// 고객 상세 정보 조회
const findById = async (query: Prisma.CustomerFindUniqueOrThrowArgs) => await prisma.customer.findUniqueOrThrow(query);

// 고객 등록
const create = async (query: Prisma.CustomerCreateArgs) => await prisma.customer.create(query);

// 고객 수정
const update = async (query: Prisma.CustomerUpdateArgs) => await prisma.customer.update(query);

// 고객 삭제
const remove = async (query: Prisma.CustomerDeleteArgs) => await prisma.customer.delete(query);

// 고객 대용량 업로드
const createMany = async (data: CustomerCsvUploadRequest[]) =>
    await prisma.customer.createMany({ data, skipDuplicates: true });

export { findAll, findById, create, update, remove, createMany };