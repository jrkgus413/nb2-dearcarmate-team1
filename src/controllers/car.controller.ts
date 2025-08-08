import { Request, Response } from 'express';
import * as carService from '../services/car.service';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../types/error.type';
import { getUser } from '../utils/user.util';
import { prisma } from '../utils/prisma.util';
import { Manufacturer, manufacturerModels } from '../types/car.type';

function convertBigIntToNumber(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToNumber(value)])
    );
  } else if (typeof obj === 'bigint') {
    return Number(obj);
  }
  return obj;
}

// 전체 차량 조회
export const getAllCars = async (req: Request, res: Response) => {
  const user = getUser(req);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [cars, totalCount] = await Promise.all([
    prisma.car.findMany({
      where: {
        isDeleted: false,
        companyId: BigInt(user.companyId),
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.car.count({
      where: {
        isDeleted: false,
        companyId: BigInt(user.companyId),
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({
    currentPage: page,
    totalPages,
    totalItemCount: totalCount,
    data: cars,
  });
};

// 차량 단건 조회
export const getCarById = async (req: Request, res: Response) => {
  const id = BigInt(req.params.carId);

  const car = await carService.getCarById(id);
  if (!car) throw new NotFoundError('존재하지 않는 차량입니다');

  res.status(200).json(convertBigIntToNumber(car));
};

// 차량 등록
export const createCar = async (req: Request, res: Response) => {
  const data = req.body;

  if (!data.carNumber || !data.manufacturer || !data.model) {
    throw new BadRequestError('필수 값이 누락되었습니다.');
  }

  const user = getUser(req);
  const companyId = BigInt(user.companyId);

  const created = await carService.createCar(data, companyId);
  res.status(201).json(convertBigIntToNumber(created));
};

// 차량 수정
export const updateCar = async (req: Request, res: Response) => {
  const id = BigInt(req.params.carId);
  const data = req.body;

  const user = getUser(req);
  const existing = await carService.getCarById(id);

  if (!existing || existing.isDeleted) {
    throw new NotFoundError('존재하지 않는 차량입니다');
  }

  if (BigInt(existing.companyId) !== BigInt(user.companyId)) {
    throw new UnauthorizedError('해당 차량을 수정할 권한이 없습니다');
  }

  const updated = await carService.updateCar(id, data);
  res.status(200).json(convertBigIntToNumber(updated));
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
  const user = getUser(req);

  await carService.uploadCars(user, req.csv);
  res.status(200).json({ message: '성공적으로 등록되었습니다.' });
};

// 차량 모델 목록 조회
export const getCarModels = (_req: Request, res: Response) => {
  const manufacturers: Manufacturer[] = Object.keys(manufacturerModels) as Manufacturer[];

  const result = manufacturers.map((manufacturer) => ({
    manufacturer,
    model: manufacturerModels[manufacturer],
  }));

  res.status(200).json({ data: result });
};