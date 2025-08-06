import { Request, Response } from 'express';
import { updateContract } from '../services/contracts.service';

export const handleUpdateContract = async (req: Request, res: Response) => {
  const body = await updateContract(req);

  res.status(200).json(body);
};
