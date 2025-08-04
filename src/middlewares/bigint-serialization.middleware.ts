import { Request, Response, NextFunction } from 'express';
import { safeJsonStringify } from '../utils/bigint.util';

export const bigintSerialization = (_req: Request, res: Response, next: NextFunction) => {
  res.json = (data) => {
    const jsonStr = safeJsonStringify(data);
    res.setHeader('Content-Type', 'application/json');
    return res.send(jsonStr);
  };

  next();
};
