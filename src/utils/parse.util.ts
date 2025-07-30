import { CarCsvUploadRequest } from '../types/car.type';
import { AgeGroup, CustomerCsvUploadRequest, Gender, Region } from '../types/customer.type';
import { BadRequestError } from '../types/error.type';

export const csvToCarList = (csv: any, companyId: bigint) => {
  const rows = csv;
  if (!rows || !Array.isArray(rows)) {
    throw new BadRequestError('[CARS] csv data is empty.');
  }

  const parsedCarList: CarCsvUploadRequest[] = rows.map((row, index) => {
    const yearStr = row.manufacturingYear;
    const mileageStr = row.mileage;
    const priceStr = row.price;
    const accidentStr = row.accidentCount;

    // 유효성 검사
    if (!/^\d{4}$/.test(yearStr)) {
      throw new BadRequestError(`[CARS][row ${index}] manufacturingYear가 4자리 숫자가 아닙니다.`);
    }

    if (!/^\d+$/.test(mileageStr)) {
      throw new BadRequestError(`[CARS][row ${index}] mileage는 숫자여야 합니다.`);
    }

    if (!/^\d+$/.test(priceStr)) {
      throw new BadRequestError(`[CARS][row ${index}] price는 숫자여야 합니다.`);
    }

    if (!/^\d+$/.test(accidentStr)) {
      throw new BadRequestError(`[CARS][row ${index}] accidentCount는 숫자여야 합니다.`);
    }

    const parsedCar: CarCsvUploadRequest = {
      companyId,
      carNumber: row.carNumber,
      manufacturer: row.manufacturer,
      model: row.model,
      manufacturingYear: parseInt(yearStr, 10),
      mileage: BigInt(mileageStr),
      price: BigInt(priceStr),
      accidentCount: parseInt(accidentStr, 10),
      explanation: row.explanation || undefined,
      accidentDetails: row.accidentDetails || undefined,
    };

    return parsedCar;
  });

  return parsedCarList;
};

export const csvToCustomerList = (csv: any, companyId: bigint) => {
  const rows = csv;
  if (!rows || !Array.isArray(rows)) {
    throw new BadRequestError('[CUSTOMERS] csv data is empty.');
  }

  const parsedCustomerList: CustomerCsvUploadRequest[] = rows.map((row, index) => {
    const gender = row.gender?.toLowerCase() as Gender;
    const ageGroup = row.ageGroup?.trim() as AgeGroup;
    const region = row.region?.trim() as Region;

    // 유효성 검사를 위한 데이터
    const validGenderList: Gender[] = ['male', 'female'];
    const validAgeGroupList: AgeGroup[] = ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'];
    const validRegionList: Region[] = [
      '서울',
      '경기',
      '인천',
      '강원',
      '충북',
      '충남',
      '세종',
      '대전',
      '전북',
      '전남',
      '광주',
      '경북',
      '경남',
      '대구',
      '울산',
      '부산',
      '제주',
    ];

    if (!validGenderList.includes(gender)) {
      throw new BadRequestError(`[CUSTOMERS][row ${index}] gender 값이 유효하지 않습니다: ${row.gender}`);
    }

    if (!validAgeGroupList.includes(ageGroup)) {
      throw new BadRequestError(`[CUSTOMERS][row ${index}] ageGroup 값이 유효하지 않습니다: ${row.ageGroup}`);
    }

    if (!validRegionList.includes(region)) {
      throw new BadRequestError(`[CUSTOMERS][row ${index}] region 값이 유효하지 않습니다: ${row.region}`);
    }

    const parsedCustomer: CustomerCsvUploadRequest = {
      companyId,
      name: row.name?.trim(),
      gender,
      phoneNumber: row.phoneNumber?.trim(),
      ageGroup,
      region,
      email: row.email?.trim(),
      memo: row.memo?.trim() || '',
    };

    return parsedCustomer;
  });

  return parsedCustomerList;
};
