import { prisma } from '../utils/prisma.util';
import { DashboardDateRange, TransactionClient } from '../types/dashboard.type';

export const getDashboard = async ({ startOfMonth, endOfMonth, startOfLastMonth, endOfLastMonth }: DashboardDateRange) => {
  return await prisma.$transaction(async (tx) => {
    // 모든 쿼리를 병렬로 실행
    const [
      monthlySalesResult,
      lastMonthSalesResult,
      proceedingContractsCountResult,
      completedContractsCountResult,
      contractsByCarTypeResult,
      salesByCarTypeResult
    ] = await Promise.all([
      monthlySales(tx, startOfMonth, endOfMonth),
      lastMonthSales(tx, startOfLastMonth, endOfLastMonth),
      proceedingContractsCount(tx),
      completedContractsCount(tx),
      contractsByCarType(tx),
      salesByCarType(tx)
    ]);

    return {
      monthlySales: monthlySalesResult,
      lastMonthSales: lastMonthSalesResult,
      proceedingContractsCount: proceedingContractsCountResult,
      completedContractsCount: completedContractsCountResult,
      contractsByCarType: contractsByCarTypeResult,
      salesByCarType: salesByCarTypeResult
    }
  }, {
    timeout: 10000, // 10초 타임아웃
    isolationLevel: 'ReadCommitted'
  })
}

// 이번달 매출  contractPrice
const monthlySales = async (tx: TransactionClient, startOfMonth: Date, endOfMonth: Date) => {
  return await tx.contract.aggregate({
    _sum: {
      contractPrice: true
    },
    where: {
      status: 'contractSuccessful',
      resolutionDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })
}

// 지난달 매출
const lastMonthSales = async (tx: TransactionClient, startOfLastMonth: Date, endOfLastMonth: Date) => {
  return await tx.contract.aggregate({
    _sum: {
      contractPrice: true
    },
    where: {
      status: 'contractSuccessful',
      resolutionDate: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  })
}

// 진행 중인 계약 건수
const proceedingContractsCount = async (tx: TransactionClient) => {
  return await tx.contract.count({
    where: {
      status: 'contractDraft'
    },
  });
}

// 완료된 계약 건수
const completedContractsCount = async (tx: TransactionClient) => {
  return await tx.contract.count({
    where: {
      status: 'contractSuccessful',
    },
  });
}

// 차량별 계약서 건수
const contractsByCarType = async (tx: TransactionClient) => {
  return await tx.car.groupBy({
    by: ['type'],
    _count: {
      id: true, // 계약서 건수
    },
    where: {
      contracts: {
        some: {
          status: 'contractSuccessful',
        },
      },
    },
  });
}

// 차량타입별 매출액
const salesByCarType = async (tx: TransactionClient) => {
 return await tx.contract.findMany({
    where: {
      status: 'contractSuccessful',
    },
    select: {
      contractPrice: true,
      car: {
        select: {
          type: true
        }
      }
    }
  });
}