import { Request, Response } from 'express';
import {
  downloadContractDocument,
  getContractDocumentDraftList,
  getContractDocumentList,
  uploadContractDocument,
} from '../services/contract-document.service';
import { getUser } from '../utils/user.util';
import { getFile } from '../utils/file.util';
import { BadRequestError } from '../types/error.type';

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
  const user = getUser(req);

  const body = await uploadContractDocument(file, user);
  res.status(200).json(body);
};

export const handleDownloadContractDocument = async (req: Request<{ id: string }>, res: Response) => {
  //const user = getUser(req);
  const { id } = req.params;

  const downloadableContractDocument = await downloadContractDocument(id);
  if (!downloadableContractDocument) {
    throw new BadRequestError('업로드된 문서가 없습니다.');
  }

  res.status(200).json({ url: downloadableContractDocument.url, message: '계약서 다운로드 성공' });
};
