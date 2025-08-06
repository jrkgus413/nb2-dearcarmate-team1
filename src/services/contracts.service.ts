import { Request } from 'express';
import { getUser } from '../utils/user.util';
import { MeetingRequest, UpdateContractRequest } from '../types/contract.type';
import { createNewContract, getContractById, updateExistContract } from '../repositories/contracts.repository';
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
