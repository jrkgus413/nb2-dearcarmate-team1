import { Request, Response } from 'express';
import { createContract, updateContract } from '../services/contracts.service';

export const handleCreateContract = async (req: Request, res: Response) => {
  const body = await createContract(req);

  res.status(201).json(body);
};

export const handleUpdateContract = async (req: Request, res: Response) => {
  const body = await updateContract(req);

  res.status(200).json(body);
};
