// 차량 등록 요청 타입
export type CarCreateRequest = {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
};

// 차량 수정 요청 타입
export type CarUpdateRequest = Partial<CarCreateRequest>;

// 차량 응답 타입
export type CarResponse = {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  type?: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  status: 'possession' | 'contractProceeding' | 'contractCompleted';
};

// TODO: 통합 고려 CSV 전용 업로드
export type CarCsvUploadRequest = {
  companyId: bigint;
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: bigint;
  price: bigint;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
};
