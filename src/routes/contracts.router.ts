import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import {
  handleCreateContract,
  handleDeleteContract,
  handleGetCarListForContract,
  handleUpdateContract,
  handleGetContracts,
  handleGetCustomerListForContract,
  handleGetUserListForContract,
} from '../controllers/contracts.controller';

const contracts = express.Router(); //ROUTE + -ER

contracts.post('/', allow([USER_ROLE.USER]), handleCreateContract); // ROUTE & ENDPOINT
contracts.patch('/:id', allow([USER_ROLE.USER]), handleUpdateContract);
// TODO: 계약 삭제
contracts.delete('/:id', allow([USER_ROLE.USER]), handleDeleteContract);
// TODO: 계약용 차량 목록
contracts.get('/cars', allow([USER_ROLE.USER]), handleGetCarListForContract);
contracts.get('/', allow([USER_ROLE.USER]), handleGetContracts); // GET /contracts

//TODO: 계약용 고객 목록 조회
contracts.get('/customers', allow([USER_ROLE.USER]), handleGetCustomerListForContract);

//TODO: 계약용 유저 목록 조회
contracts.get('/users', allow([USER_ROLE.USER]), handleGetUserListForContract);

export default contracts;
