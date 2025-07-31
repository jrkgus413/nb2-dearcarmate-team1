import express from 'express';
import {
  handleGetContractDocumentList,
  handleGetContractDocumentDraftList,
  handleUploadContractDocument,
  handleDownloadContractDocument,
} from '../controllers/contract-document.controller';

const contractDocument = express.Router();

// 계약서 업로드 시 계약 목록 조회
contractDocument.get('/', handleGetContractDocumentList);
// 계약서 추가 시 계약 목록 조회
contractDocument.get('/draft', handleGetContractDocumentDraftList);
// 계약서 업로드
contractDocument.post('/upload', handleUploadContractDocument);
// 계약서 다운로드
contractDocument.get('/:id/download', handleDownloadContractDocument);

export default contractDocument;
