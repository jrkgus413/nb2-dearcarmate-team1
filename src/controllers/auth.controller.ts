import { Request, Response } from 'express';
import { login, refresh } from '../services/auth.service';

export const handleLogin = async (req: Request, res: Response) => {
  const data = await login(req);

  res.status(200).json(data);
};

export const handleRefresh = async (req: Request, res: Response) => {
  const data = await refresh(req);

  res.status(200).json(data);
};
