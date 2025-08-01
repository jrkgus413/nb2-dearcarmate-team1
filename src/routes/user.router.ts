// routes/user.route.ts

import { Router } from 'express';
import {
  register,
} from '../controllers/user.controller';

const userRouter = Router();

//회원가입 
userRouter.post('/', register);
//내 정보 조회 
//userRouter.get('/me', getMyInfo);
//내 정보 수정 
//userRouter.patch('/me', updateMyInfo);
//회원탈퇴 
//userRouter.delete('/me', deleteMyAccount);
//유저 삭제(관리자 전용)
//userRouter.delete('/:id', adminDeleteUser); 

export default userRouter;
