// routes/user.route.ts

import { Router } from 'express';
import {
  register,
  getMyInfo,
  updateMyInfo,
  deleteMyAccount,
  adminDeleteUser,
} from '../controllers/user.controller';

const router = Router();

//회원가입 
router.post('/', register);
//내 정보 조회 
router.get('/me', getMyInfo);
//내 정보 수정 
router.patch('/me', updateMyInfo);
//회원탈퇴 
router.delete('/me', deleteMyAccount);
//유저 삭제(관리자 전용)
router.delete('/:id', adminDeleteUser); 

export default router;
