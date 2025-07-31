/**
 * 계약 상태
 * carInspection : 차량 확인
 * priceNegotiation : 가격 협의
 * contractDraft : 계약서 작성 중
 * contractSuccessful : 계약 성공
 * contractFailed : 계약 실패
 */
export type ContractStatus = 'carInspection' | 'priceNegotiation' | 'contractDraft' | 'contractSuccessful' | 'contractFailed';
