export type CompanyCreateRequest = {
  companyName: string;
  companyCode: string;
}

export type CompanyListRequest = {
  whereCondition: object;
  pageSize: number;
  page: number;
}

export type CompanyGetQuery = { 
  page?: number; 
  pageSize?: number; 
  searchBy?: 'companyName' | 'companyCode'; // 더 구체적인 타입
  keyword?: string 
}

export type CompanyUpdateRequest = Partial<CompanyCreateRequest>; 

export type CompanyResponse = {
  companyId: bigint
  companyName: string;
  companyCode: string;
  userCount: number;
}
