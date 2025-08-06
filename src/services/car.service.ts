import * as carRepo from '../repositories/car.repository';
import { CarCreateRequest, CarCsvUploadRequest, CarUpdateRequest } from '../types/car.type';
import { Payload } from '../types/payload.type';
import { csvToCarList } from '../utils/parse.util';

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
