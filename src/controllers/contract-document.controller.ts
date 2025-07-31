import { Request, Response } from 'express';
import {
  downloadContractDocument,
  getContractDocumentDraftList,
  getContractDocumentList,
  uploadContractDocument,
} from '../services/contract-document.service';
import { UnauthorizedError } from '../types/error.type';

export const handleGetContractDocumentList = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError();
  }
  await getContractDocumentList(BigInt(user.id), req.body);
  res.status(200).json({});
};

export const handleGetContractDocumentDraftList = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError();
  }
  await getContractDocumentDraftList();
  res.status(200).json({});
};

export const handleUploadContractDocument = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError();
  }
  await uploadContractDocument();
  res.status(200).json({ contractDocumentId: 1 });
};

export const handleDownloadContractDocument = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError();
  }
  await downloadContractDocument();
  res.status(200).json({ message: '계약서 다운로드 성공' });
};
