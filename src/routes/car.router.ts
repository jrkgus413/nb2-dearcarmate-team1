import { Router } from 'express';
import * as carController from '../controllers/car.controller';
import { csvUploader } from '../utils/uploader';
import { csvToObject } from '../middlewares/csv-parser.middleware';

const router = Router();

// 차량 목록 조회
router.get('/', carController.getAllCars);

// 차량 상세 조회
router.get('/:carId', carController.getCarById);

// 차량 등록
router.post('/', carController.createCar);

// 차량 수정
router.patch('/:carId', carController.updateCar);

// 차량 삭제 (Soft Delete)
router.delete('/:carId', carController.deleteCar);

// 차량 대용량 업로드
router.post('/upload', csvUploader.single('file'), csvToObject, carController.uploadCars);

// 차량 모델 목록 조회
router.get('/models', carController.getCarModels);

export default router;
