import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { handleCreateContract,  handleDeleteContract,  handleUpdateContract } from '../controllers/contracts.controller';

const contracts = express.Router(); //ROUTE + -ER

contracts.post('/', allow([USER_ROLE.USER]), handleCreateContract); // ROUTE & ENDPOINT
contracts.patch('/:id', allow([USER_ROLE.USER]), handleUpdateContract);
// TODO: 계약 삭제
contracts.delete('/:id', allow([USER_ROLE.USER]), handleDeleteContract);

export default contracts;
