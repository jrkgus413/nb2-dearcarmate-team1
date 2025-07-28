import { CarCsvUploadRequest } from '../types/car.type';
import { BadRequestError } from '../types/error.type';

export const csvToCarList = (csv: any) => {
  const rows = csv;
  if (!rows || !Array.isArray(rows)) {
    throw new BadRequestError('[CARS] csv data is empty.');
  }

  const parsedCars: CarCsvUploadRequest[] = rows.map((row, index) => {
    const parsed: CarCsvUploadRequest = {
      carNumber: row.carNumber,
      manufacturer: row.manufacturer,
      model: row.model,
      manufacturingYear: parseInt(row.manufacturingYear),
      mileage: BigInt(row.mileage),
      price: BigInt(row.price),
      accidentCount: parseInt(row.accidentCount),
      explanation: row.explanation || undefined,
      accidentDetails: row.accidentDetails || undefined,
    };

    if (isNaN(parsed.manufacturingYear)) {
      throw new BadRequestError(`[row ${index}] manufacturingYear가 유효하지 않습니다.`);
    }

    return parsed;
  });

  return parsedCars;
};
