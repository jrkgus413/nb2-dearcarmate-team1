import { Request, Response } from 'express';
import * as carService from '../services/car.service';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../types/error.type';

// 전체 차량 조회
export const getAllCars = async (_req: Request, res: Response) => {
  const cars = await carService.getAllCars();
  res.status(200).json(cars);
};

// 차량 단건 조회
export const getCarById = async (req: Request, res: Response) => {
  const id = BigInt(req.params.carId);

  const car = await carService.getCarById(id);
  if (!car) throw new NotFoundError('존재하지 않는 차량입니다');

  res.status(200).json(car);
};

// 차량 등록
export const createCar = async (req: Request, res: Response) => {
  const data = req.body;

  if (!data.carNumber || !data.manufacturer || !data.model) {
    throw new BadRequestError('필수 값이 누락되었습니다.');
  }

  const created = await carService.createCar(data);
  res.status(201).json(created);
};

// 차량 수정
export const updateCar = async (req: Request, res: Response) => {
  const id = BigInt(req.params.carId);
  const data = req.body;

  const existing = await carService.getCarById(id);
  if (!existing) throw new NotFoundError('존재하지 않는 차량입니다');

  const updated = await carService.updateCar(id, data);
  res.status(200).json(updated);
};

// 차량 삭제
export const deleteCar = async (req: Request, res: Response) => {
  const id = BigInt(req.params.carId);

  const existing = await carService.getCarById(id);
  if (!existing) throw new NotFoundError('존재하지 않는 차량입니다');

  await carService.deleteCar(id);
  res.status(200).json({ message: '차량 삭제 성공' });
};

// 차량 대용량 업로드
export const uploadCars = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError();
  }

  await carService.uploadCars(req.csv, BigInt(user.id));

  res.status(200).json({ message: '성공적으로 등록되었습니다.' });
};

// 차량 모델 목록 조회
export const getCarModels = async (_req: Request, res: Response) => {
  const carModels: { manufacturer: string; model: string }[] = await carService.getCarModels();

  const grouped: Record<string, Set<string>> = carModels.reduce(
    (acc: Record<string, Set<string>>, car) => {
      if (!acc[car.manufacturer]) {
        acc[car.manufacturer] = new Set();
      }
      acc[car.manufacturer].add(car.model);
      return acc;
    },
    {}
  );

  const result = Object.entries(grouped).map(([manufacturer, modelSet]) => ({
    manufacturer,
    model: Array.from(modelSet),
  }));

  res.status(200).json({ data: result });
};
