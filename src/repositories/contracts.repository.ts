/* import { Prisma } from '@prisma/client';
import { UpdateContractRequest } from '../types/contract.type';
import { BadRequestError } from '../types/error.type'; */
import { Prisma } from '@prisma/client';
import { MeetingRequest, UpdateContractRequest } from '../types/contract.type';
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
  await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      car: {
        select: {
          id: true,
          model: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      documents: {
        select: {
          id: true,
          fileName: true,
        },
      },
      meetings: {
        select: {
          date: true,
          alarms: true,
        },
      },
    },
  });

export const updateExistContract = async (contractId: bigint, request: UpdateContractRequest) => {
  const updatedExistContract = await await prisma.$transaction(async (tx) => {
    const existContract = await tx.contract.findUnique({
      where: { id: contractId },
      include: {
        car: {
          select: {
            id: true,
            model: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const updateOption: Prisma.ContractUpdateInput = {};

    if (request.status !== undefined) {
      updateOption.status = request.status;
    }
    if (request.resolutionDate !== undefined) {
      updateOption.resolutionDate = new Date(request.resolutionDate);
    }
    if (request.contractPrice !== undefined) {
      updateOption.contractPrice = request.contractPrice;
    }
    if (request.userId !== undefined) {
      updateOption.user = { connect: { id: request.userId } };
    }
    if (request.customerId !== undefined) {
      updateOption.customer = { connect: { id: request.customerId } };
    }
    if (request.carId !== undefined) {
      updateOption.car = { connect: { id: request.carId } };
    }

    // 2. USER, CAR, CUSTOMER 유무 확인
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
      updateOption.userName = user.name;
    }
    if (car) {
      updateOption.carNumber = car.carNumber;
      updateOption.contractName = `${car.model} - ${existContract!.customer.name} 고객님`;
    }
    if (customer) {
      updateOption.contractName = `${existContract!.car.model} - ${customer.name} 고객님`;
    }

    // 3. 계약 업데이트
    await tx.contract.update({
      where: { id: contractId },
      data: updateOption,
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
            date: new Date(meeting.date),
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
      const existingDocumentList = await tx.contractDocument.findMany({
        where: { contractId },
        select: { fileId: true },
      });

      const incomingFileIdList = request.contractDocuments.map((document) => document.id);
      const existingFileIdList = existingDocumentList.map((document) => Number(document.fileId));

      const fileIdsToDelete = existingFileIdList.filter((id) => !incomingFileIdList.includes(id));

      if (fileIdsToDelete.length > 0) {
        await tx.contractDocument.deleteMany({
          where: {
            contractId,
            fileId: { in: fileIdsToDelete },
          },
        });
      }

      for (const document of request.contractDocuments) {
        if (!existingFileIdList.includes(document.id)) {
          await tx.contractDocument.create({
            data: {
              fileName: document.fileName,
              file: { connect: { id: document.id } },
              contract: { connect: { id: contractId } },
            },
          });
        }
      }
    }

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

    return await tx.contract.findUnique({ where: { id: contractId }, include: includeOption });
  });

  return updatedExistContract;
};

// TODO : 계정 삭제(soft)
// repositoy : 저장소, 데이터베이스 접근 하는 코드
export const deleteExistContract = async (contractId: bigint) => {
  // 1. deletedAt, isDeleted 를 업데이트 하면 된다.
  return await prisma.contract.update({
    // WHERE : contractId 기반으로 찾음
    where:{
      id: contractId,
    },
    // DATA : 어떤 데이터가 업데이트 될 것인지 작성
    data:{
      deletedAt: new Date(),
      isDeleted: true,
    }
  });
};

export const findCarListNoContract = async (companyId: bigint) => {
  // - 회사마다 소유한 자동차가 다름.
  // - 계약이 없는 자동차만 보여야 함.

  return await prisma.car.findMany({
    where:{
      companyId,
      contracts : {
        none:{}
      }
    }
  });

};