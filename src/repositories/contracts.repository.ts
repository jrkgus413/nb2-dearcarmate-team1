import { UpdateContractRequest } from '../types/contract.type';
import { BadRequestError } from '../types/error.type';
import { prisma } from '../utils/prisma.util';

export const getContractById = async (contractId: bigint) =>
  await prisma.contract.findUnique({ where: { id: contractId } });

export const patchContract = async (contractId: bigint, request: UpdateContractRequest) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. 계약 정보 업데이트
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: {
          status: request.status,
          resolutionDate: request.resolutionDate,
          contractPrice: request.contractPrice,
          userId: request.userId,
          customerId: request.customerId,
          carId: request.carId,
        },
        include: {
          meetings: {
            include: { alarms: true },
          },
          user: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true },
          },
          car: {
            select: { id: true, model: true },
          },
        },
      });

      // 2. 미팅 전체 삭제 후 새로 생성
      // 겹치는지 확인해도 되지만,
      // 날짜를 일일이 체크하는 게 귀찮아서 그냥 삭제 후 생성으로 처리
      await tx.meeting.deleteMany({ where: { contractId } });

      if (request.meetings) {
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

      // 3. 계약 문서 동기화
      if (request.contractDocuments) {
        const existingDocList = await tx.contractDocument.findMany({
          where: { contractId },
          select: { fileId: true },
        });

        const incomingFileIdList = request.contractDocuments.map((document) => document.id);
        const existingFileIdList = existingDocList.map((document) => Number(document.fileId));

        const fileIdListToDelete = existingFileIdList.filter((id) => !incomingFileIdList.includes(id));

        if (fileIdListToDelete.length > 0) {
          await tx.contractDocument.deleteMany({
            where: {
              contractId,
              fileId: { in: fileIdListToDelete },
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
