import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { handleUpdateContract } from '../controllers/contracts.controller';

const contracts = express.Router();

contracts.patch('/:id', allow([USER_ROLE.USER]), handleUpdateContract);

export default contracts;
