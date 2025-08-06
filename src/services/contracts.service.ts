import { Request } from 'express';
import { getUser } from '../utils/user.util';
import { UpdateContractRequest } from '../types/contract.type';
import { getContractById, patchContract } from '../repositories/contracts.repository';
import { ForbiddenError, NotFoundError } from '../types/error.type';

export const updateContract = async (req: Request) => {
  const user = getUser(req);
  const contractId = BigInt(req.params.id);
  const body: UpdateContractRequest = req.body;

  const existContract = await getContractById(contractId);
  if (!existContract) {
    throw new NotFoundError('존재하지 않는 계약입니다.');
  }

  const isUserContractManager = BigInt(user.id) === existContract.userId;
  if (!isUserContractManager) {
    throw new ForbiddenError('담당자만 수정이 가능합니다.');
  }

  const updatedContract = await patchContract(contractId, body);

  return updatedContract;
};
