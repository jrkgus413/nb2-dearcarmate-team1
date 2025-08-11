import * as carRepo from '../repositories/car.repository';
import { CarCreateRequest, CarCsvUploadRequest, CarUpdateRequest } from '../types/car.type';
import { Payload } from '../types/payload.type';
import { csvToCarList } from '../utils/parse.util';
import { prisma } from '../utils/prisma.util';
import { NotFoundError } from '../types/error.type';

// 전체 차량 조회
export const getAllCars = async () => {
  return await carRepo.findAll();
};

// 차량 단건 조회
export const getCarById = async (id: bigint) => {
  return await carRepo.findById(id);
};

// 차량 등록
export const createCar = async (data: CarCreateRequest, companyId: bigint) => {
  const deletedCar = await carRepo.findDeletedByCarNumber(data.carNumber, companyId);

  if (deletedCar) {
    return await carRepo.update(deletedCar.id, {
      ...data,
      isDeleted: false,
      deletedAt: null,
      status: 'possession', // 초기 상태로
    });
  }

  const dataWithCompanyId = { ...data, companyId }; 
  return await carRepo.create(dataWithCompanyId);
};

// 차량 수정
export const updateCar = async (id: bigint, data: CarUpdateRequest) => {
  return await carRepo.update(id, data);
};

// 차량 삭제 (soft delete)
export const deleteCar = async (id: bigint) => {
  return await carRepo.softDelete(id);
};

export const deleteCarCascade = async (carId: bigint, companyId: bigint) => {
  return prisma.$transaction(async (tx) => {
    // 1) 차량 소유/존재 확인
    const car = await tx.car.findFirst({
      where: { id: carId, companyId, isDeleted: false },
      select: { id: true },
    });
    if (!car) throw new NotFoundError('존재하지 않거나 이미 삭제된 차량입니다.');

    // 계약 문서 삭제
    await tx.contractDocument.deleteMany({
      where: { contract: { carId } },
    });

    // 미팅 알람 삭제
    await tx.alarm.deleteMany({
      where: { meeting: { contract: { carId } } },
    });

    // 미팅 삭제
    await tx.meeting.deleteMany({
      where: { contract: { carId } },
    });

    // 계약 소프트 삭제
    await tx.contract.updateMany({
      where: { carId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    // 차량 이미지 실제 삭제 (원하면 소프트로 바꿔도 됨)
    await tx.carImage.deleteMany({
      where: { carId },
    });

    // 차량 소프트 삭제
    await tx.car.update({
      where: { id: carId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { id: Number(carId) };
  });
};

// 차량 대용량 업로드
export const uploadCars = async (user: Payload, csv: any) => {
  const companyId: bigint = BigInt(user.companyId);
  const data: CarCsvUploadRequest[] = csvToCarList(csv, companyId);
  return await carRepo.createMany(data, companyId);
};

// 차량 모델 목록 조회
export const getCarModels = async () => {
  return await carRepo.findAllModels();
};
