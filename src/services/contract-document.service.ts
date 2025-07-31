import { getContractList, getContractListWithDocument } from '../repositories/contract-document.repository';
import { GetContractListRequest } from '../types/contract-document.type';
import { ParsedQs } from 'qs';

export const getContractDocumentList = async (companyId: bigint, query: ParsedQs) => {
  const { page = '1', pageSize = '10', searchBy = '', keyword = '' } = query;

  const data: GetContractListRequest = {
    page: parseInt(page as string, 10),
    pageSize: parseInt(pageSize as string, 10),
    searchBy: searchBy as string,
    keyword: keyword as string,
  };

  return await getContractListWithDocument(data, companyId);
};

export const getContractDocumentDraftList = async (companyId: bigint) => {
  return await getContractList(companyId);
};

export const uploadContractDocument = async () => {};

export const downloadContractDocument = async () => {};
