import { Request, Response } from 'express';
import {
  createContract,
  deleteContract,
  getCarListForContract,
  getContractList,
  getCustomerListForContract,
  getUserListForContract,
  updateContract,
} from '../services/contracts.service';

export const handleCreateContract = async (req: Request, res: Response) => {
  const body = await createContract(req);

  res.status(201).json(body);
};

export const handleUpdateContract = async (req: Request, res: Response) => {
  const body = await updateContract(req);

  res.status(200).json(body);
};

export const handleGetContracts = async (req: Request, res: Response) => {
  const result = await getContractList(req);
  res.status(200).json(result);
};

// TODO : handleDeleteContract
export const handleDeleteContract = async (req: Request, res: Response) => {
  const body = await deleteContract(req);

  res.status(200).json(body);
};

// TODO : handleGetCarListForContract
export const handleGetCarListForContract = async (req: Request, res: Response) => {
  const body = await getCarListForContract(req);

  res.status(200).json(body);
};

//TODO: handleGetcustomersListForContract
export const handleGetCustomerListForContract = async (req: Request, res: Response) => {
  const body = await getCustomerListForContract(req);

  res.status(200).json(body);
};

//TODO: handleGetusersListForContract
export const handleGetUserListForContract = async (req: Request, res: Response) => {
  const body = await getUserListForContract(req);

  res.status(200).json(body);
};
