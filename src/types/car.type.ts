export type Manufacturer =
  | '현대'
  | '기아'
  | 'BMW'
  | '벤츠'
  | '쉐보레'
  | '아우디'
  | '폭스바겐'
  | '도요타'
  | '테슬라'
  | '르노'
  | '볼보'
  | '지프';

  export const manufacturerModels: Record<Manufacturer, string[]> = {
  현대: ['아반떼', '쏘나타', '그랜저', '투싼', '베뉴', '싼타페', '팰리세이드', '아이오닉5', '아이오닉6'],
  기아: ['K3', 'K5', 'K7', 'K9', 'K8', '스포티지', '쏘렌토', '셀토스', 'EV6'],
  BMW: ['320i', '520d', 'X5'],
  벤츠: ['E클래스', 'S클래스', 'GLC'],
  쉐보레: ['스파크', '말리부', '트랙스'],
  아우디: ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'],
  폭스바겐: ['골프', '파사트', '티구안', '투아렉', 'ID.4', 'ID.3'],
  도요타: ['프리우스', '캠리', '라브4'],
  테슬라: ['모델3', '모델Y', '모델S'],
  르노: ['클리오', '캡처', '조에', '마스터', '트위지'],
  볼보: ['XC40', 'XC60', 'XC90'],
  지프: ['랭글러', '체로키', '그랜드 체로키'],
};


// 차량 등록 요청 타입
export type CarCreateRequest = {
  carNumber: string;
  manufacturer: Manufacturer;
  model:( typeof  manufacturerModels)[Manufacturer][number];
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  type: string;
  status?: string;
  isDeleted?: boolean;   
  deletedAt?: Date | null; 
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
  type: string; 
};