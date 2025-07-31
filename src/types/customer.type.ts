export type Gender = 'male' | 'female';

export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대' | '60대' | '70대' | '80대';

export type Region =
  | '서울'
  | '경기'
  | '인천'
  | '강원'
  | '충북'
  | '충남'
  | '세종'
  | '대전'
  | '전북'
  | '전남'
  | '광주'
  | '경북'
  | '경남'
  | '대구'
  | '울산'
  | '부산'
  | '제주';

export type CustomerCsvUploadRequest = {
  companyId: bigint;
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup: AgeGroup;
  region: Region;
  email: string;
  memo: string;
};

export type CustomerCreateData = Omit<CustomerCsvUploadRequest, "companyId">