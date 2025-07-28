// 차량 등록 요청 타입
export type CarCreateRequest = {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: bigint;
  price: bigint;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  status: string;
  companyId: bigint;
  uploadFileId?: bigint;
};

// 차량 수정 요청 타입
export type CarUpdateRequest = Partial<CarCreateRequest>;

// 차량 응답 타입
export type CarResponse = {
  id: bigint;
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: bigint;
  price: bigint;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  status: string;
  imageUrl?: string;
  companyId: bigint;
  uploadFileId?: bigint;
  createdAt: Date;
  updatedAt: Date;
};