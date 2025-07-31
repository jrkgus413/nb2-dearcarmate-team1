import { getContractListWithDocument } from '../repositories/contract-document.repository';
import { GetContractListRequest } from '../types/contract-document.type';

export const getContractDocumentList = async (_userId: bigint, body: GetContractListRequest) => {
  const companyId: bigint = BigInt(1); // getCompanyByUserId
  return await getContractListWithDocument(body, companyId);
};

export const getContractDocumentDraftList = async () => {};

export const uploadContractDocument = async () => {};

export const downloadContractDocument = async () => {};
