import * as carRepo from '../repositories/car.repository';
import { CarCreateRequest, CarCsvUploadRequest, CarUpdateRequest } from '../types/car.type';
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
export const createCar = async (data: CarCreateRequest) => {
  return await carRepo.create(data);
};

// 차량 수정
export const updateCar = async (id: bigint, data: CarUpdateRequest) => {
  return await carRepo.update(id, data);
};

// 차량 삭제 (soft delete)
export const deleteCar = async (id: bigint) => {
  return await carRepo.softDelete(id);
};

// [TODO] 차량 대용량 업로드
export const uploadCars = async (csv: any) => {
  const cars: CarCsvUploadRequest[] = csvToCarList(csv);
  return await carRepo.createMany(cars);
};

// [TODO] 차량 모델 목록 조회
export const getCarModels = async () => {
  return await carRepo.findDistinctModels();
};
