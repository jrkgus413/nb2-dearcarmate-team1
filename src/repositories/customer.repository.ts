import { createData, CustomerCsvUploadRequest } from '../types/customer.type';
import { prisma } from '../utils/prisma.util';

const findAll = async (query: any) => await prisma.customer.findMany(query);

const findById = async (id: bigint) => await prisma.customer.findUniqueOrThrow({ where: { id } });

const create = async (data: createData) => await prisma.customer.create({ data });

const remove = async (id: bigint) => await prisma.customer.delete({ where: { id } });

const createMany = async (data: CustomerCsvUploadRequest[]) =>
  await prisma.customer.createMany({ data, skipDuplicates: true });

export { findAll, findById, create, remove, createMany };
