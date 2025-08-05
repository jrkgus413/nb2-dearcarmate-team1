import { Router } from 'express';
import { register } from '../controllers/user.controller';

const router = Router();

//회원가입
router.post('/', register);

export default router;
