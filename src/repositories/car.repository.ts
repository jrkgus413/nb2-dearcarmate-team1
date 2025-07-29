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
export const create = (data: CarCreateRequest) => {
  return prisma.car.create({ data });
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

//
export const createMany = async (cars: CarCsvUploadRequest[]) => {
  return await prisma.car.createMany({ data: cars, skipDuplicates: true });
};

// [TODO] 차량 모델 목록 조회
export const findDistinctModels = async () => {
  return await prisma.car.findMany({
    distinct: ['model'],
    select: {
      manufacturer: true,
      model: true,
    },
    where: {
      isDeleted: false,
    },
  });
};
