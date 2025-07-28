export type FileCreateRequest = {
  url: string;
  name: string;
  ext: string;
  size: bigint;
};

export type FileResponse = {
  id: bigint;
  url: string;
  name: string;
  ext: string;
  size: bigint;
  createdAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
};
