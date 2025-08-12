import { GetContractListRequest } from '../types/contract-document.type';
import { FileCreateRequest } from '../types/file.type';
import { Payload } from '../types/payload.type';
import { prisma } from '../utils/prisma.util';

// [계약서 업로드] 시 계약 목록 조회
export const getContractListWithDocument = async (body: GetContractListRequest, user: Payload) => {
  const { page, pageSize, searchBy, keyword } = body;

  const skip = (page - 1) * pageSize;

  const where = {
    companyId: BigInt(user.companyId),
    ...(keyword && searchBy
      ? {
          [searchBy]: {
            contains: keyword,
            mode: 'insensitive',
          },
        }
      : {}),
    documents: {
      some: {},
    },
  };

  const totalItemCount = await prisma.contract.count({
    where,
  });

  const contractList = await prisma.contract.findMany({
    where,
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
      user: {
        select: {
          name: true,
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
    documentCount: contract.documents.length,
    userName: contract.user.name,
    carNumber: contract.car.carNumber,
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

// [계약서 추가] 시 계약 목록 조회
export const getContractList = async (user: Payload) => {
  const where = {
    companyId: BigInt(user.companyId),
    userId: BigInt(user.id),
    isDeleted: false,
    deletedAt: null,
    status: 'contractSuccessful',
    documents: {
      none: {},
    },
  };

  const contractList = await prisma.contract.findMany({
    where,
    include: {
      car: {
        select: {
          model: true,
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  return contractList.map((contract) => ({
    id: contract.id,
    data: contract.contractName,
  }));
};

export const createContractDocument = async (fileCreateRequest: FileCreateRequest, _user: Payload) => {
  const createdContractDocument = await prisma.file.create({ data: fileCreateRequest });

  return createdContractDocument;
};

export const getContractDocument = async (contractDocumentId: bigint) =>
  await prisma.file.findUnique({
    where: { id: contractDocumentId },
  });
