import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';

const router = Router();

//회원가입
router.post('/', UserController.register);
//내 정보 조회
router.get('/me', allow([USER_ROLE.USER]), UserController.getMyInfo);

export default router;
