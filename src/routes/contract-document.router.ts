import express from 'express';
import {
  handleGetContractDocumentList,
  handleGetContractDocumentDraftList,
  handleUploadContractDocument,
  handleDownloadContractDocument,
} from '../controllers/contract-document.controller';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';

const contractDocument = express.Router();

// 계약서 업로드 시 계약 목록 조회
contractDocument.get('/', allow([USER_ROLE.USER]), handleGetContractDocumentList);
// 계약서 추가 시 계약 목록 조회
contractDocument.get('/draft', allow([USER_ROLE.USER]), handleGetContractDocumentDraftList);
// 계약서 업로드
contractDocument.post('/upload', allow([USER_ROLE.USER]), handleUploadContractDocument);
// 계약서 다운로드
contractDocument.get('/:id/download', allow([USER_ROLE.USER]), handleDownloadContractDocument);

export default contractDocument;
