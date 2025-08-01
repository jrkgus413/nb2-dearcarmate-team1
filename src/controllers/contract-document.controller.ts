import { Request, Response } from 'express';
import {
  downloadContractDocument,
  getContractDocumentDraftList,
  getContractDocumentList,
  uploadContractDocument,
} from '../services/contract-document.service';
import { getUser } from '../utils/user.util';
import { getFile } from '../utils/file.util';

export const handleGetContractDocumentList = async (req: Request, res: Response) => {
  const user = getUser(req);

  const body = await getContractDocumentList(BigInt(user.companyId), req.query);

  res.status(200).json(body);
};

export const handleGetContractDocumentDraftList = async (req: Request, res: Response) => {
  const user = getUser(req);

  const body = await getContractDocumentDraftList(BigInt(user.companyId));

  res.status(200).json(body);
};

export const handleUploadContractDocument = async (req: Request, res: Response) => {
  const file = getFile(req);
  //const user = getUser(req);

  const body = await uploadContractDocument(file);
  res.status(200).json(body);
};

export const handleDownloadContractDocument = async (_req: Request, res: Response) => {
  //const user = getUser(req);

  await downloadContractDocument();
  res.status(200).json({ message: '계약서 다운로드 성공' });
};
