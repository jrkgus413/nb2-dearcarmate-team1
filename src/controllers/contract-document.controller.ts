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

  const body = await getContractDocumentList(user, req.query);

  res.status(200).json(body);
};

export const handleGetContractDocumentDraftList = async (req: Request, res: Response) => {
  const user = getUser(req);

  const body = await getContractDocumentDraftList(user);

  res.status(200).json(body);
};

export const handleUploadContractDocument = async (req: Request, res: Response) => {
  const file = getFile(req);
  //const user = getUser(req);

  const body = await uploadContractDocument(file);
  res.status(200).json(body);
};

export const handleDownloadContractDocument = async (req: Request<{ id: string }>, res: Response) => {
  //const user = getUser(req);
  const { id } = req.params;

  await downloadContractDocument(id);

  res.status(200).json({ message: '계약서 다운로드 성공' });
};
