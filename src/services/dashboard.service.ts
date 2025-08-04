import { DashboardDateRange, DashboardResponse } from "../types/dashboard.type";
import * as dashboardRepository from '../repositories/dashboard.repository';

/**
 * @description 대시보드 데이터 조회
 */

export const getDashboard = async ({ startOfMonth, endOfMonth, startOfLastMonth, endOfLastMonth }: DashboardDateRange) => {
  const {
    monthlySales,
    lastMonthSales,
    proceedingContractsCount,
    completedContractsCount,
    contractsByCarType,
    salesByCarType
  } = await dashboardRepository.getDashboard({
    startOfMonth,
    endOfMonth,
    startOfLastMonth,
    endOfLastMonth
  });

  // 차량별 계약서 건수 포맷팅
  const formattedContractsByCarType = contractsByCarType.map(car => ({
    carType: car.type,
    count: car._count.id ?? 0, // BigInt로 처리
  }));
  // 차량별 매출액 포맷팅
  const formattedTotalPriceByCarType = salesByCarType.map(car => ({
    carType: car.type,
    sales: Number(car._sum.totalPrice) ?? 0n, // BigInt로 처리
  }));

  // 지난달 매출
  const lastMonthSalesValue = lastMonthSales._sum.totalPrice ?? 0n;
  // 이번달 매출
  const currentMonthSalesValue = monthlySales._sum.totalPrice ?? 0n;
  // 성장률 계산
  const growthRate = calculateGrowthRate(Number(currentMonthSalesValue), Number(lastMonthSalesValue));

  const formattedDashboard: DashboardResponse = {
    monthlySales: Number(monthlySales._sum.totalPrice) ?? null,
    lastMonthSales: Number(lastMonthSales._sum.totalPrice) ?? null,
    growthRate: growthRate,
    proceedingContractsCount: proceedingContractsCount || 0,
    completedContractsCount: completedContractsCount || 0,
    contractsByCarType: formattedContractsByCarType || [],
    salesByCarType: formattedTotalPriceByCarType || []
  };

  return formattedDashboard;
}

/**
 * 성장률 계산 함수
 */
const calculateGrowthRate = (currentSales: number, lastMonthSales: number): number => {
  if (lastMonthSales === 0) return currentSales > 0 ? 100 : 0;
  return Math.round(((currentSales - lastMonthSales) / lastMonthSales) * 100);
};
