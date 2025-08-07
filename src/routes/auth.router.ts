import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { handleLogin, handleRefresh } from '../controllers/auth.controller';

const auth = express.Router();

auth.post('/login', allow([USER_ROLE.NONE]), handleLogin);
auth.post('/refresh', allow([USER_ROLE.NONE]), handleRefresh);

export default auth;
