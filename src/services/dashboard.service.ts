import { ContractsByCarType, DashboardDateRange, DashboardResponse} from "../types/dashboard.type";
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
  const formattedSalesByCarType = reduceSalesByCarType(salesByCarType);
  
  // 지난달 매출
  const lastMonthSalesValue = lastMonthSales._sum.contractPrice ?? 0n;
  // 이번달 매출
  const currentMonthSalesValue = monthlySales._sum.contractPrice ?? 0n;
  // 성장률 계산
  const growthRate = calculateGrowthRate(Number(currentMonthSalesValue), Number(lastMonthSalesValue));

  const formattedDashboard: DashboardResponse = {
    monthlySales: Number(monthlySales._sum.contractPrice) ?? null,
    lastMonthSales: Number(lastMonthSales._sum.contractPrice) ?? null,
    growthRate: growthRate,
    proceedingContractsCount: proceedingContractsCount || 0,
    completedContractsCount: completedContractsCount || 0,
    contractsByCarType: formattedContractsByCarType || [],
    salesByCarType: formattedSalesByCarType || []
  };
  return formattedDashboard;
}

// 차량 타입별로 매출액 합계 계산
const reduceSalesByCarType = (result: any[]): ContractsByCarType[] => {
  const reduceSale = result.reduce((acc, contract) => {
    const carType = contract.car.type;
    if (!acc[carType]) {
      acc[carType] = 0;
    }
    acc[carType] += Number(contract.contractPrice) || 0;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(reduceSale).map(([carType, sales]) => ({
    carType,
    count: Number(sales)
  }));
}

/**
 * 성장률 계산 함수
 */
const calculateGrowthRate = (currentSales: number, lastMonthSales: number): number => {
  if (lastMonthSales === 0) return currentSales > 0 ? 100 : 0;
  return Math.round(((currentSales - lastMonthSales) / lastMonthSales) * 100);
};
