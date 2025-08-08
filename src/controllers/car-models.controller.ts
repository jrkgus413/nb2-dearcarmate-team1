import { Request, Response } from 'express';
import { Manufacturer, manufacturerModels } from '../types/car.type';

export const getCarModels = (_req: Request, res: Response) => {
  const manufacturers: Manufacturer[] = Object.keys(manufacturerModels) as Manufacturer[];

  const result = manufacturers.map((manufacturer) => ({
    manufacturer,
    models: manufacturerModels[manufacturer],
  }));

  res.status(200).json(result);
};
