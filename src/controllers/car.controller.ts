import { NextFunction, Request, Response } from 'express';
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

// 차량 목록 조회 (검색 + 상태 필터)
export const getAllCars = async (req: Request, res: Response) => {
  const user = getUser(req);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.pageSize as string) || 10;
  const skip = (page - 1) * limit;

  const searchBy = req.query.searchBy as string;
  const keyword = req.query.keyword as string;
  const status = req.query.status as string;

  // 기본 where 조건
  const whereClause: any = {
    isDeleted: false,
    companyId: BigInt(user.companyId),
  };

  // 상태 필터 추가
  if (status) {
    whereClause.status = status;
  }

  // 검색 조건 추가
  if (searchBy && keyword) {
    if (searchBy === 'carNumber') {
      whereClause.carNumber = keyword;
    } else if (searchBy === 'model') {
      whereClause.model = keyword;
    }
  }

  const [cars, totalCount] = await Promise.all([
    prisma.car.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.car.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({
    currentPage: page,
    totalPages,
    totalItemCount: totalCount,
    data: cars.map(convertBigIntToNumber),
  });
};

// 차량 등록
export const createCar = async (req: Request, res: Response) => {
  const data = req.body;

  // type 기본값 설정
  if (!data.type) {
    data.type = "세단";
  }

  // 필수 값 체크
  if (
    !data.carNumber ||
    !data.manufacturer ||
    !data.model ||
    !data.type ||
    data.price === undefined || data.price === null || data.price <= 0 || // 가격 0 불가
    data.accidentCount === undefined || data.accidentCount === null // 사고횟수는 null/undefined만 불가
  ) {
    console.error('차량 등록 누락된 필드:', {
      carNumber: data.carNumber,
      manufacturer: data.manufacturer,
      model: data.model,
      type: data.type,
      price: data.price,
      accidentCount: data.accidentCount
    });

    return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
  }

  const user = getUser(req);
  const companyId = BigInt(user.companyId);

  try {
    const created = await carService.createCar(data, companyId);
    res.status(201).json(convertBigIntToNumber(created));
  } catch (error) {
    console.error('차량 등록 중 에러 발생:', error);
    res.status(500).json({ message: '차량 등록에 실패했습니다.' });
  }
};

// 차량 수정
export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.carId);
    const incoming = req.body ?? {};

    const user = getUser(req);
    const existing = await carService.getCarById(id);

    if (!existing || existing.isDeleted) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }
    if (BigInt(existing.companyId) !== BigInt(user.companyId)) {
      throw new UnauthorizedError('해당 차량을 수정할 권한이 없습니다');
    }

    // --- 여기서 accidentCount만 안전하게 변환/검증 ---
    const data: any = { ...incoming };

    if ('accidentCount' in data) {
      // "0", "", 0 등 케이스 허용
      const raw = typeof data.accidentCount === 'string'
        ? data.accidentCount.trim()
        : data.accidentCount;

      // 빈 문자열이면 0으로 취급
      const parsed = raw === '' ? 0 : Number(raw);

      if (!Number.isInteger(parsed) || parsed < 0) {
        throw new BadRequestError('accidentCount는 0 이상의 정수여야 합니다.');
      }
      data.accidentCount = parsed; // 숫자로 고정
    } else {
      // 필드가 아예 안 왔으면 그대로 두어 부분 업데이트가 되게 함
    }
    // --------------------------------------------------

    const updated = await carService.updateCar(id, data);
    res.status(200).json(convertBigIntToNumber(updated));
  } catch (err) {
    // 에러 원인 파악을 위해 로깅 후 에러 미들웨어로 전달
    console.error('[cars:update]', err);
    next(err);
  }
};

// 차량 삭제
export const deleteCar = async (req: Request, res: Response) => {
  const user = getUser(req);
  const companyId = BigInt(user.companyId);
  const carId = BigInt(req.params.carId);

  const result = await carService.deleteCarCascade(carId, companyId);

  res.status(200).json({
    message: '차량 삭제 성공',
    carId: result.id,
  });
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