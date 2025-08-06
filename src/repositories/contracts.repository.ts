/* import { Prisma } from '@prisma/client';
import { UpdateContractRequest } from '../types/contract.type';
import { BadRequestError } from '../types/error.type'; */
import { MeetingRequest } from '../types/contract.type';
import { BadRequestError } from '../types/error.type';
import { prisma } from '../utils/prisma.util';

export const createNewContract = async (
  userId: bigint,
  companyId: bigint,
  carId: bigint,
  customerId: bigint,
  meetings: MeetingRequest[]
) => {
  const createdContract = await prisma.$transaction(async (tx) => {
    // 해당 차량이 먼저 계약된 건이 있는지 확인
    const existContractWithCar = await tx.contract.findFirst({
      where: {
        carId: carId,
        isDeleted: false,
      },
    });
    if (existContractWithCar) {
      throw new BadRequestError('이미 계약 중인 차량입니다.');
    }

    // USER, COMPANY, CAR, CUSTOMER 데이터베이스 접근
    const [existUser, existCompany, existCar, existCustomer] = await Promise.all([
      tx.user.findUnique({ where: { id: userId } }),
      tx.company.findUnique({ where: { id: companyId } }),
      tx.car.findUnique({ where: { id: carId } }),
      tx.customer.findUnique({ where: { id: customerId } }),
    ]);

    // 하나라도 없다면 진행하면 안됌.
    if (!existUser || !existCompany || !existCar || !existCustomer) {
      throw new BadRequestError();
    }

    const status = 'carInspection'; // 기본값

    const contractName = `${existCar.model} - ${existCustomer.name} 고객님`;

    // 미팅 만들기 위한 옵션
    const meetingOption = {
      create: meetings.map((meeting) => ({
        date: new Date(meeting.date),
        alarms: {
          create: meeting.alarms.map((alarm) => ({
            time: new Date(alarm),
          })),
        },
      })),
    };

    // 인클루드 옵션
    const includeOption = {
      meetings: {
        include: {
          alarms: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      car: {
        select: {
          id: true,
          model: true,
        },
      },
    };

    return await tx.contract.create({
      data: {
        userId: existUser.id,
        companyId: existCompany.id,
        carId: existCar.id,
        customerId: existCustomer.id,
        userName: existUser.name,
        contractName,
        carNumber: existCar.carNumber,
        status,
        meetings: meetingOption,
      },
      include: includeOption,
    });
  });

  return createdContract;
};

export const getContractById = async (contractId: bigint) =>
  await prisma.contract.findUnique({ where: { id: contractId } });
/* 
export const updateContractWithTransaction = async (existContract: Prisma., request: UpdateContractRequest) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. 동적으로 contract update data 구성
      const contractUpdateData: Prisma.ContractUpdateInput = {};

      if (request.status !== undefined) {
        contractUpdateData.status = request.status;
      }
      if (request.resolutionDate !== undefined) {
        contractUpdateData.resolutionDate = request.resolutionDate;
      }
      if (request.contractPrice !== undefined) {
        contractUpdateData.contractPrice = request.contractPrice;
      }
      if (request.userId !== undefined) {
        contractUpdateData.user = { connect: { id: request.userId } };
      }
      if (request.customerId !== undefined) {
        contractUpdateData.customer = { connect: { id: request.customerId } };
      }
      if (request.carId !== undefined) {
        contractUpdateData.car = { connect: { id: request.carId } };
      }

      // 2. 연관 정보 조회 및 userName, carNumber, contractName 설정
      const [user, car, customer] = await Promise.all([
        request.userId ? tx.user.findUnique({ where: { id: request.userId }, select: { name: true } }) : undefined,
        request.carId
          ? tx.car.findUnique({ where: { id: request.carId }, select: { model: true, carNumber: true } })
          : undefined,
        request.customerId
          ? tx.customer.findUnique({ where: { id: request.customerId }, select: { name: true } })
          : undefined,
      ]);

      if (request.userId && !user) {
        throw new BadRequestError('유효하지 않은 사용자입니다.');
      }
      if (request.carId && !car) {
        throw new BadRequestError('유효하지 않은 차량입니다.');
      }
      if (request.customerId && !customer) {
        throw new BadRequestError('유효하지 않은 고객입니다.');
      }

      if (user) {
        contractUpdateData.userName = user.name;
      }
      if (car) {
        contractUpdateData.carNumber = car.carNumber;
        contractUpdateData.contractName = `${car.model} - ${customer.name} 고객님`;
      }
      if (customer) {
        contractUpdateData.contractName = `${car.model} - ${customer.name} 고객님`;
      }

      // 3. 계약 업데이트 (include로 관계도 함께 가져옴)
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: contractUpdateData,
        include: {
          meetings: { include: { alarms: true } },
          user: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          car: { select: { id: true, model: true } },
        },
      });

      // 4. 미팅 전체 삭제 후 재생성
      if (request.meetings !== undefined) {
        await tx.meeting.deleteMany({ where: { contractId } });

        for (const meeting of request.meetings) {
          await tx.meeting.create({
            data: {
              date: meeting.date,
              contract: { connect: { id: contractId } },
              alarms: {
                create: meeting.alarms.map((alarm) => ({
                  time: new Date(alarm),
                })),
              },
            },
          });
        }
      }

      // 5. 계약 문서 동기화
      if (request.contractDocuments !== undefined) {
        const existingDocs = await tx.contractDocument.findMany({
          where: { contractId },
          select: { fileId: true },
        });

        const incomingFileIds = request.contractDocuments.map((doc) => doc.id);
        const existingFileIds = existingDocs.map((doc) => Number(doc.fileId));

        const fileIdsToDelete = existingFileIds.filter((id) => !incomingFileIds.includes(id));

        if (fileIdsToDelete.length > 0) {
          await tx.contractDocument.deleteMany({
            where: {
              contractId,
              fileId: { in: fileIdsToDelete },
            },
          });
        }

        for (const doc of request.contractDocuments) {
          if (!existingFileIds.includes(doc.id)) {
            await tx.contractDocument.create({
              data: {
                fileName: doc.fileName,
                file: { connect: { id: doc.id } },
                contract: { connect: { id: contractId } },
              },
            });
          }
        }
      }

      // 6. 반환 형식 맞춰서 가공
      return {
        id: Number(updatedContract.id),
        status: updatedContract.status,
        resolutionDate: updatedContract.resolutionDate.toISOString(),
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
    });
  } catch (error) {
    throw new BadRequestError('잘못된 요청입니다.');
  }
};
 */
