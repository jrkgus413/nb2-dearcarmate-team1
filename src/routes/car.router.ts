import { Router } from 'express';
import * as carController from '../controllers/car.controller';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { csvUploader } from '../utils/uploader';
import { csvToObject } from '../middlewares/csv-parser.middleware';

const router = Router();

// 사용자 인증 미들웨어 적용
router.use(allow([USER_ROLE.USER, USER_ROLE.ADMIN]));

// 차량 모델 목록 조회
router.get('/models', carController.getCarModels);

// 차량 번호 또는 차종으로 상세 조회 (새로 추가)
router.get('/search', carController.getAllCars);

// 차량 목록 조회
router.get('/', carController.getAllCars);

// 차량 등록
router.post('/', carController.createCar);

// 차량 수정
router.patch('/:carId', carController.updateCar);

// 차량 삭제 (Soft Delete)
router.delete('/:carId', carController.deleteCar);

// 차량 대용량 업로드
router.post('/upload', allow([USER_ROLE.USER]), csvUploader.single('file'), csvToObject, carController.uploadCars);

export default router;
