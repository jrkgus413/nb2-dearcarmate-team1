import express, { Request, Response } from 'express';
const app = express();
const router = express.Router();

app.use(express.json());
app.use('/', router);
app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
// 특정 라우터 미들웨어 (필요할 때만)
// router.use(yourMiddleware);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// import { Model } from 'firebase-admin/machine-learning'; // 제거: 사용하지 않음

// 타입 정의
type MeetingInput = {
    date: string | Date;
    alarms?: (string | Date)[];
};

// 계약서 생성(등록)
router.post('/create', async (req: Request, res: Response) => {
    try {
        const { carId, customerId, meetings = [] }: { carId: number, customerId: number, meetings?: MeetingInput[] } = req.body;
        const meetingsToCreate = (meetings as MeetingInput[]).map((meeting: MeetingInput) => ({
            date: new Date(meeting.date),
            alarms: {
                create: (meeting.alarms ?? []).map((time: string | Date) => ({ time: new Date(time) }))
            }
        }));

        const newContract = await prisma.contract.create({
            data: {
                carId,
                customerId,
                meetings: { create: meetingsToCreate }
            },
            include: {
                meetings: { include: { alarms: true } }
            }
        });

        res.status(201).json({
            message: '계약서가 성공적으로 생성되었습니다.',
            data: newContract
        });
    } catch (error: any) {
        console.error('계약서 생성 중 오류:', error);
        res.status(500).json({
            message: '계약서 생성에 실패했습니다.',
            error: error.message
        });
    }
});

// 계약 업로드 목록 조회
router.get('/uploads', async (_req: Request, res: Response) => {
    try {
        const contracts = await prisma.contract.findMany({
            select: {
                id: true,
                car: { select: { id: true, model: true } },
                customer: { select: { id: true, name: true } },
                user: { select: { id: true, name: true } },
                meetings: {
                    select: {
                        date: true,
                        alarms: { select: { time: true } }
                    }
                },
                contractPrice: true,
                resolutionDate: true,
                status: true
            }
        });

        // 상태별 그룹화 및 미팅 알람 시간만 추출
        const grouped = contracts.reduce((acc: any, contract: any) => {
            const status = contract.status;
            const processed = {
                contract,
                meetings: contract.meetings.map((m: any) => ({
                    data: m.data,
                    alarms: m.alarms.map((a: any) => a.time)
                }))
            };
            //acc란 accumulator의 약자로 누적된 결과를 저장하는 객체이다.
            if (!acc[status]) acc[status] = { totalItemCount: 0, data: [] };
            acc[status].data.push(processed);
            acc[status].totalItemCount++;
            return acc;
        }, {});

        res.status(200).json({
            message: '업로드 된 계약 목록이 성공적으로 조회되었습니다.',
            data: grouped
        });
    } catch (error: any) {
        console.error('계약 목록 조회 오류:', error);
        res.status(500).json({
            message: '업로드 된 계약 목록 조회에 실패했습니다.',
            error: error.message
        });
    }
});
//차량 목록 조회
router.get('/vehicles', async (_req: Request, res: Response) => {
    try {
        // Prisma를 사용하여 Car 모델에서 id, model, plateNumber 필드를 조회
        const vehicles = await prisma.car.findMany({
            select: {
                id: true,
                model: true,
                plateNumber: true
            }
        });
        
        // 조회된 데이터를 응답 형식에 맞게 가공
        const formattedVehicles = vehicles.map((vehicle: { id: number; model: string; plateNumber: string }) => ({
            id: vehicle.id,
            Model: vehicle.model,
            data: `${vehicle.model}(${vehicle.plateNumber})`
        }));
        
        return res.status(200).json({
            message: '차량 목록이 성공적으로 조회되었습니다.',
            data: formattedVehicles
        });

    } catch (error: unknown) {
        console.error('차량 목록 조회 중 오류 발생:', error);
        let errorMessage = '알 수 없는 오류';
        if (error instanceof Error) errorMessage = error.message;
        return res.status(500).json({
            message: '차량 목록 조회에 실패했습니다.',
            error: errorMessage
        });
    }
});



// 계약용 목록 조회 헬퍼 함수

type ListFactoryModel = {
    findMany: (args: { select: { id: true; name: true; email?: true } }) => Promise<Array<{ id: number; name: string; email?: string }>>;
};
type ListFactory = (model: ListFactoryModel, message: string, hasEmail?: boolean) => (req: Request, res: Response) => Promise<void>;

const listFactory: ListFactory = (model, message, hasEmail = false) => {
    return async (_req: Request, res: Response): Promise<void> => {
        try {
            const selectFields: any = { id: true, name: true };
            if (hasEmail) selectFields.email = true;

            const items = await model.findMany({ select: selectFields });

            const formattedItems = items.map((item: { id: number; name: string; email?: string }) => ({
                id: item.id,
                data: hasEmail ? `${item.name}(${item.email})` : item.name
            }));

            res.status(200).json({
                message: `${message}이 성공적으로 조회되었습니다.`,
                data: formattedItems
            });
        } catch (error: unknown) {
            console.error(`${message} 조회 중 오류 발생:`, error);
            let errorMessage = '알 수 없는 오류';
            if (error instanceof Error) errorMessage = error.message;
            res.status(500).json({
                message: `${message} 조회에 실패했습니다.`,
                error: errorMessage
            });
        }
    };
};

// 계약용 고객 목록 조회 API
router.get('/customers', listFactory(prisma.customer, '고객 목록', true));

// 계약서 수정 API
router.put('/contract/:id', async (req: Request, res: Response) => {
    const contractID = req.params.id;
    const updatedData = req.body;
    try {
        const updatedContract = await prisma.contract.update({
            where: { id: Number(contractID) },
            data: updatedData
        });
        res.status(200).json({ message: '계약서가 수정되었습니다.', data: updatedContract });
    } catch (error: unknown) {
        let errorMessage = '알 수 없는 오류';
        if (error instanceof Error) errorMessage = error.message;
        res.status(500).json({ message: '계약서 수정에 실패했습니다.', error: errorMessage });
    }
});

// 계약서 삭제 API
router.delete('/contract/:id', async (req: Request, res: Response) => {
    const contractID = req.params.id;
    try {
        await prisma.contract.delete({ where: { id: Number(contractID) } });
        res.status(200).json({ message: '계약서가 삭제되었습니다.' });
    } catch (error: unknown) {
        let errorMessage = '알 수 없는 오류';
        if (error instanceof Error) errorMessage = error.message;
        res.status(500).json({ message: '계약서 삭제에 실패했습니다.', error: errorMessage });
    }
});