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
    const body = (req.body ?? {}) as Record<string, unknown>;

    const user = getUser(req);
    const existing = await carService.getCarById(id);
    if (!existing || existing.isDeleted) throw new NotFoundError('존재하지 않는 차량입니다');
    if (BigInt(existing.companyId) !== BigInt(user.companyId)) {
      throw new UnauthorizedError('해당 차량을 수정할 권한이 없습니다');
    }
    
    const data: any = {};
    ([
      'carNumber', 'manufacturer', 'model', 'type',
      'manufacturingYear', 'mileage', 'price', 'totalPrice',
      'accidentCount', 'explanation', 'accidentDetails',
      'status', 'imageUrl',
    ] as const).forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(body, k)) data[k] = body[k];
    });

    // 문자열 필드 트림 
    ['carNumber', 'manufacturer', 'model', 'type', 'status'].forEach((k) => {
      if (k in data && typeof data[k] === 'string') data[k] = (data[k] as string).trim();
    });
    ['explanation', 'accidentDetails'].forEach((k) => {
      if (k in data && typeof data[k] === 'string') {
        const t = (data[k] as string).trim();
        data[k] = t === '' ? null : t;
      }
    });
    // imageUrl: 빈문자면 null, 값 있으면 그대로
    if ('imageUrl' in data) {
      if (typeof data.imageUrl === 'string') {
        const t = data.imageUrl.trim();
        data.imageUrl = t === '' ? null : t;
      } else if (data.imageUrl == null) {
        data.imageUrl = null;
      }
    }
  
    if ('manufacturingYear' in data && data.manufacturingYear !== '') {
      const n = Number(data.manufacturingYear);
      if (!Number.isFinite(n)) throw new BadRequestError('manufacturingYear는 숫자여야 합니다.');
      data.manufacturingYear = n;
    } else {
      delete data.manufacturingYear;
    }

    if ('accidentCount' in data) {
      const n = data.accidentCount === '' ? 0 : Number(data.accidentCount);
      if (!Number.isInteger(n) || n < 0) {
        throw new BadRequestError('accidentCount는 0 이상의 정수여야 합니다.');
      }
      data.accidentCount = n;
    }
    
    if ('mileage' in data) {
      if (data.mileage === '' || data.mileage == null) delete data.mileage;
      else data.mileage =
        typeof data.mileage === 'bigint' ? data.mileage as bigint
        : typeof data.mileage === 'number' ? BigInt(Math.trunc(data.mileage as number))
        : BigInt(String(data.mileage));
    }
    if ('price' in data) {
      if (data.price === '' || data.price == null) delete data.price;
      else data.price =
        typeof data.price === 'bigint' ? data.price as bigint
        : typeof data.price === 'number' ? BigInt(Math.trunc(data.price as number))
        : BigInt(String(data.price));
    }
    if ('totalPrice' in data) {
      if (data.totalPrice === '' || data.totalPrice == null) delete data.totalPrice;
      else data.totalPrice =
        typeof data.totalPrice === 'bigint' ? data.totalPrice as bigint
        : typeof data.totalPrice === 'number' ? BigInt(Math.trunc(data.totalPrice as number))
        : BigInt(String(data.totalPrice));
    }

    const updated = await carService.updateCar(id, data);
    res.status(200).json(convertBigIntToNumber(updated));
  } catch (err) {
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