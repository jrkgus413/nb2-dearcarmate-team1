import { Request } from 'express';
import { getUser } from '../utils/user.util';
import { MeetingRequest, UpdateContractRequest } from '../types/contract.type';
import { createNewContract, deleteExistContract, getContractById, updateExistContract } from '../repositories/contracts.repository';
import { BadRequestError, ForbiddenError, NotFoundError } from '../types/error.type';
import { Payload } from '../types/payload.type';

export const createContract = async (req: Request) => {
  const user: Payload = getUser(req);
  const carId: string = req.body.carId;
  const customerId: string = req.body.customerId;
  const meetings: MeetingRequest[] = req.body.meetings;

  if (!carId || !customerId || !meetings) {
    throw new BadRequestError();
  }

  const userIdFromRequest = BigInt(user.id);
  const companyIdFromRequest = BigInt(user.companyId);
  const carIdFromRequest = BigInt(carId);
  const customerIdFromRequest = BigInt(customerId);
  const meetingsFromRequest = meetings;

  const createdContract = await createNewContract(
    userIdFromRequest,
    companyIdFromRequest,
    carIdFromRequest,
    customerIdFromRequest,
    meetingsFromRequest
  );

  return {
    id: Number(createdContract.id),
    status: createdContract.status,
    resolutionDate: createdContract.resolutionDate ?? null,
    contractPrice: Number(createdContract.contractPrice ?? 0),
    meetings: createdContract.meetings.map((m) => ({
      date: m.date,
      alarms: m.alarms.map((a) => a.time),
    })),
    user: {
      id: Number(createdContract.user.id),
      name: createdContract.user.name,
    },
    customer: {
      id: Number(createdContract.customer.id),
      name: createdContract.customer.name,
    },
    car: {
      id: Number(createdContract.car.id),
      model: createdContract.car.model,
    },
  };
};

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

  const updatedContract = await updateExistContract(contractId, body);
  if (!updatedContract) {
    throw new BadRequestError();
  }

  return {
    id: Number(updatedContract.id),
    status: updatedContract.status,
    resolutionDate: updatedContract.resolutionDate?.toISOString() ?? null,
    contractPrice: Number(updatedContract.contractPrice),
    meetings: updatedContract.meetings.map((meeting) => ({
      date: meeting.date.toISOString(),
      alarms: meeting.alarms.map((alarm) => alarm.time.toISOString()),
    })),
    user: {
      id: Number(updatedContract.user.id),
      name: updatedContract.user.name,
    },
    customer: {
      id: Number(updatedContract.customer.id),
      name: updatedContract.customer.name,
    },
    car: {
      id: Number(updatedContract.car.id),
      model: updatedContract.car.model,
    },
  };
};

// TODO : deleteContract
export const deleteContract = async (req: Request) => {
  const user = getUser(req);
  
  // 1. 어떤 계약(contract)을 지우는가 -> 지울 계약의 id 가 필요
  // localhost:3001/contracts/1
  // app.use('/:id', ~~~~);
  // parameters = {id, *, * ...}
  const contractId = BigInt(req.params.id);

  // 1.1. 해당 계약이 존재하는지 -> 아니면 404
  const existContract = await getContractById(contractId);
  if (!existContract) {
    throw new NotFoundError('존재하지 않는 계약입니다.');
  }

  // 1.2. 해당 계약의 담당자가 지금 로그인한 유저 인지 -> 아니면 403
  const isUserContractManager = BigInt(user.id) === existContract.userId;
  if (!isUserContractManager) {
    throw new ForbiddenError('담당자만 삭제가 가능합니다.');
  }
  

  // 2. soft delete 를 하기 위해서는 무엇을 해야 하는가
  // soft : deletedAt, isDeleted 만 업데이트 해주면 됨.
  await deleteExistContract(contractId);

  // 3. 삭제하고 나서 뭐라고 보내줘야 하나?
  return {
    message: '계약 삭제 성공'
  };
};