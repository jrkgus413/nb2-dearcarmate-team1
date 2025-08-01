import {
  createContractDocument,
  getContractList,
  getContractListWithDocument,
} from '../repositories/contract-document.repository';
import { GetContractListRequest } from '../types/contract-document.type';
import { ParsedQs } from 'qs';
import { bucket } from '../utils/firebase';
import { FileCreateRequest } from '../types/file.type';

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

export const uploadContractDocument = async (file: Express.Multer.File) => {
  return new Promise(async (resolve, reject) => {
    const fileName = `contractDocuments/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('[contractDocuments] blob stream error: ', error);
      reject(error);
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const name = file.originalname;
        const ext = file.originalname.split('.').pop() || '';
        const size = BigInt(file.size);
        const fileCreateRequest: FileCreateRequest = {
          url,
          name,
          ext,
          size,
        };

        const createdContractDocument = await createContractDocument(fileCreateRequest);
        resolve({ contractDocumentId: Number(createdContractDocument.id) });
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
};

export const downloadContractDocument = async () => {};
