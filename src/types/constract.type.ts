//계약 목록 조회 타입
export type Contract = {
    id: number;
    carId: number;
    custumerId: number;
    meetings: {
        date: string;
        alarms: string[];
    }
}
//계약 목록 조회 타입
export type ContractListResponse = {
     carId: number;
  customerId: number;
  meetings: {
    date: string;
    alarms: string[];
    message: string;
    data: Contract[];
}}

//계약 수정
export type updateContract = {
    id: number;
    resolutionDate: string;
    contractPrice: number;
    userId: number;
    customerId: number;
    carid: number;
    alarms: string[];
}

