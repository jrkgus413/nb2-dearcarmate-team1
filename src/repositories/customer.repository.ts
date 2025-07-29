import { prisma } from '../utils/prisma.util';

const findAll = async (query:any) => await prisma.customer.findMany(query);

const findById = async (id: bigint) => await prisma.customer.findUniqueOrThrow({ where:{ id } });

const create = async(data: any) => await prisma.customer.create({ data });

const remove = async(id:bigint) => await prisma.customer.delete({ where:{ id } });

export {
    findAll,
    findById,
    create,
    remove
};