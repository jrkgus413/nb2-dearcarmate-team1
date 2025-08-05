import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { handleLogin } from '../controllers/auth.controller';

const auth = express.Router();

auth.post('/login', allow([USER_ROLE.PUBLIC]), handleLogin);

export default auth;
