import { prisma } from '../utils/prisma.util';
import { CarCreateRequest, CarCsvUploadRequest, CarUpdateRequest } from '../types/car.type';

// 전체 차량 조회
export const findAll = () => {
  return prisma.car.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });
};

// 차량 단건 조회
export const findById = (id: bigint) => {
  return prisma.car.findUnique({
    where: { id },
  });
};

// 차량 등록
export const create = (data: CarCreateRequest & { companyId: bigint }) => {
  return prisma.car.create({
    data: {
      ...data,
      status: "possession",
      companyId: BigInt(data.companyId),
    },
  });
};

// 차량 수정
export const update = (id: bigint, data: CarUpdateRequest) => {
  return prisma.car.update({
    where: { id },
    data,
  });
};

// 차량 삭제 (Soft Delete)
export const softDelete = (id: bigint) => {
  return prisma.car.update({
    where: { id },
    data: { isDeleted: true },
  });
};

// 차량 대용량 업로드
export const createMany = async (cars: CarCsvUploadRequest[]) => {
  const prepared = cars.map((car) => ({
    ...car,
    status: "possession",         
    companyId: BigInt(1),        // 임시 값 (나중에 동적으로 처리 가능)
  }));

  return await prisma.car.createMany({
    data: prepared,
    skipDuplicates: true,
  });
};

// 차량 모델 목록 조회
export const findAllModels = async () => {
  return await prisma.car.findMany({
    select: {
      manufacturer: true,
      model: true,
    },
    where: {
      isDeleted: false,
    },
  });
};