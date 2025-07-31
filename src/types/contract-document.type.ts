export type GetContractListRequest = {
  page: number; // 페이지 번호
  pageSize: number; // 페이지 당 아이템 수
  searchBy: string; // 검색 기준
  keyword: string; // 검색어
};
