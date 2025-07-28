import { RequestHandler } from 'express';
import { getHealthCheck } from '../services/root.service';

export const handleGetHealthCheck: RequestHandler = async (_req, res) => {
  const data = getHealthCheck();

  res.status(200).json(data);
};
