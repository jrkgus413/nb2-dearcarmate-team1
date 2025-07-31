import { prisma } from '../utils/prisma.util';

// 이번달 매출
export const monthlySales = async(startOfMonth:Date, endOfMonth:Date) => {
  return await prisma.car.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        contracts: {
          some: {
            resolutionDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      },
    })
}

// 지난달 매출
export const lastMonthSales = async(startOfLastMonth:Date, endOfLastMonth:Date) => {
  return await prisma.car.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        contracts: {
          some: {
            resolutionDate: {
              gte: startOfLastMonth,
              lte: endOfLastMonth,
            },
          },
        },
      },
    })
}

// 진행 중인 계약 건수
export const proceedingContractsCount = async() => {
  return await prisma.contract.count({
    where: {
      status: 'contractDraft'
    },
  });
}

// 완료된 계약 건수
export const completedContractsCount = async() => {
  return await prisma.contract.count({
    where: {
      status: 'contractSuccessful',
    },
  });
}

// 차량별 계약서 건수
export const contractsByCarType = async() => {
  return await prisma.car.groupBy({
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

// 차량별 매출액
export const salesByCarType = async() => {
  return await prisma.car.groupBy({
    by: ['type'],
    _sum: {
      totalPrice: true,
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