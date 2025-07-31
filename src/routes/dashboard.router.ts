import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller';

const router = express.Router();

// 대시보드 데이터 조회
router.route('/').get(getDashboard);

export default router;