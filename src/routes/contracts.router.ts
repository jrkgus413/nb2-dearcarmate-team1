import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { handleCreateContract, handleUpdateContract } from '../controllers/contracts.controller';

const contracts = express.Router();

contracts.post('/', allow([USER_ROLE.USER]), handleCreateContract);
contracts.patch('/:id', allow([USER_ROLE.USER]), handleUpdateContract);

export default contracts;
