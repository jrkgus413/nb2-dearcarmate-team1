import { parse } from 'csv-parse';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../types/error.type';

export const csvToObject = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new BadRequestError('[CSV PARSER] no .csv file');
  }

  parse(
    req.file.buffer,
    {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    },
    (error, output: any[]) => {
      if (error) {
        console.error('[CSV PARSER] ', error);
        throw new BadRequestError('[CSV PARSER] parse error');
      }

      req.csv = output;

      next();
    }
  );
};
