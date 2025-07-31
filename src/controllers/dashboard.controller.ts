import { Request, Response } from 'express';
import { DashboardResponse } from "../types/dashboard.type";
import * as dashboardService from '../services/dashboard.service';

/**
 * @description 대시보드 데이터 조회
 */
export const getDashboard = async (_req: Request, res: Response) => {
  // 현재 날짜
  const currentMonth = new Date();
  // 현재 월의 시작일과 마지막일 계산
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  // 지난 월의 시작일과 마지막일 계산
  const startOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

  const response: DashboardResponse = await dashboardService.getDashboard({
    startOfMonth,
    endOfMonth,
    startOfLastMonth,
    endOfLastMonth
  });

  res.status(200).json(response);
}
