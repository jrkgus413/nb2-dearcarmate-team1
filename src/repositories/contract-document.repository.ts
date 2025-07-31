import { GetContractListRequest } from '../types/contract-document.type';
import { prisma } from '../utils/prisma.util';

// 계약 목록 조희
export const getContractListWithDocument = async (body: GetContractListRequest, _companyId: bigint) => {
  const { page, pageSize, searchBy, keyword } = body;

  const skip = (page - 1) * pageSize;

  const where =
    keyword && searchBy
      ? {
          [searchBy]: {
            contains: keyword,
            mode: 'insensitive',
          },
        }
      : {};

  const totalItemCount = await prisma.contract.count({
    where: where,
  });

  const contractList = await prisma.contract.findMany({
    where: where,
    skip,
    take: pageSize,
    include: {
      documents: {
        select: {
          id: true,
          fileName: true,
        },
      },
      car: {
        select: {
          carNumber: true,
        },
      },
    },
    orderBy: {
      resolutionDate: 'desc',
    },
  });

  const data = contractList.map((contract) => ({
    id: contract.id,
    contractName: contract.contractName,
    resolutionDate: contract.resolutionDate,
    documentsCount: contract.documents.length,
    manager: contract.userId,
    carNumber: contract.carId,
    documents: contract.documents,
  }));

  const totalPages = Math.ceil(totalItemCount / pageSize);

  return {
    currentPage: page,
    totalPages,
    totalItemCount,
    data,
  };
};
