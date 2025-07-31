export type DashboardResponse = {
  monthlySales: number | null, // 이번달 매출
  lastMonthSales: number | null, // 지난달 매출
  growthRate: number, // 성장률
  proceedingContractsCount: number, // 진행 중인 계약 건수
  completedContractsCount: number, // 완료된 계약 건수
  contractsByCarType: ContractsByCarType[],
  salesByCarType: SalesByCarType[]
}

export type ContractsByCarType = {
  carType: string,
  count: number
}

export type SalesByCarType = {
  carType: string,
  sales: number
}

// 대시보드 날짜 데이터 타입
export type DashboardDateRange = {
  startOfMonth: Date,
  endOfMonth: Date,
  startOfLastMonth: Date,
  endOfLastMonth: Date
}